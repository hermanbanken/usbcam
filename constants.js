// @see https://www.beyondlogic.org/usbnutshell/usb6.shtml
const bmRequestType = {
    read: 0xC0,
    write: 0x40,
}

const bmRequest = {
    get_status: 0x00,
    clear_feature: 0x01,
    set_feature: 0x03,
    set_address: 0x05,
    get_descriptor: 0x06,
    set_descriptor: 0x07,
    get_configuration: 0x08,
    set_configuration: 0x09,
}

// @see http://media.digikey.com/PDF/Data%20Sheets/Avago%20PDFs/ADNS-5000.pdf
const registers = {
    motion: 0x02,
    deltax: 0x03,
    deltay: 0x04,
    squal: 0x05,
    shutter_upper: 0x06,
    shutter_lower: 0x07,
    pixel_max: 0x08,
    pixel_avg: 0x09,
    pixel_min: 0x1a,
    pixGrab: 0x0b,
}

module.exports = {
    bmRequestType,
    bmRequest,
    registers,
};