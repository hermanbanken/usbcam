const usb = require("usb");
const { promisify } = require("bluebird");
const { bmRequestType, bmRequest, registers } = require("./constants");
const { p } = require("./utils");
const { output, outputPixel, outputInfo } = require("./output");

async function main() {
    console.log("Starting");
    const device = usb.findByIds(1121, 19733);
    global.device = device;
    device.open(false);
    process.on("exit", () => device.close());

    // Clear configuration
    await promisify(device.setConfiguration).call(device, 0);
    await p(cb => device.controlTransfer(bmRequestType.write, bmRequest.clear_feature, 0x0000, 0x0d, Buffer.from([0x01]), cb))

    while (true) {
        // await readInfo(device);
        // await p(cb => setTimeout(cb, 33));
        // Pixels!
        await readFrameBuffer(device, true, 3);
    }
}

/**
 * @param {usb.Device}
 */
async function readInfo(d) {
    const read = (n) => p(cb => d.controlTransfer(bmRequestType.read, bmRequest.clear_feature, 0x0000, n, 0x01, cb)).then(bytes => bytes[0]);
    // Get info
    const info = {
        dx: await read(registers.deltax),
        dy: await read(registers.deltay),
        squal: await read(registers.squal),
        shutter_upper: await read(registers.shutter_upper),
        shutter_lower: await read(registers.shutter_lower),
        
        min: await read(registers.pixel_min),
        max: await read(registers.pixel_max),
        avg: await read(registers.pixel_avg) / 1.75,
    };
    outputInfo(info);
}

/**
 * @param {usb.Device}
 * @param {boolean} sendFullFames whether to output pixels or full frames
 * @param {number} readDelay to reduce noise use minimal 4ms
 * @see https://github.com/rezeck/MouseCam/blob/master/mouseCam.py
 */
async function readFrameBuffer(d, sendFullFames = false, readDelay = 4) {
    // Clear PIX_GRAB
    await p(cb => d.controlTransfer(bmRequestType.write, bmRequest.clear_feature, 0x0000, registers.pixGrab, Buffer.from([0x01]), cb));
    const pixels = [];
    for (let i = 0; i < 225; i++) {
        await p(cb => setTimeout(cb, readDelay));
        const result = await p(cb => d.controlTransfer(bmRequestType.read, bmRequest.clear_feature, 0x0000, registers.pixGrab, 0x01, cb));
        pixels.push(result);
        if (!sendFullFames) {
            outputPixel(Buffer.from([i, result[0]]));
        }
    }
    if (sendFullFames) {
        output(Buffer.concat(pixels));
    }
}

main().catch(e => console.error(e));
