const pcap = require('pcap')
const session = pcap.createSession();
const server = require('http').createServer();
const io = require('socket.io')(server);
const childProc = require('child_process');

function openLocalhost(site) {
  childProc.exec('open -a "Google Chrome" ' + site, ()=> console.log('BROWSER OPENED: ' + site));
}


try {
  console.log('INITIALIZING')
  console.log(process.env)
  if (process.env.FILE_PATH){
    
    openLocalhost(process.env.FILE_PATH)
  }
  
  console.log('CONNECTING TO SOCKET...')
  
  io.on('connection', socket => {
    
    session.on('packet', raw_packet => {
      const packet = pcap.decode.packet(raw_packet)
      const payload = packet.payload.payload.payload
   
      if (payload && payload.constructor.name === "TCP"){
        console.log(payload.constructor.name)
        const { data } = payload

        if (data !== null ) {
          const buffer = data
          const size = Buffer.byteLength(buffer)
          const circleData = buffer
          .toString('hex')
          .match(/([a-zA-Z\d]{6})/g)
          .map(hex => {
            return {
              fill: '#' + hex,
              stoke: hex.slice(0,3),
              radius: parseInt(size) / 100 ,
              velocity: size * 0.05,
              x: Math.random(),
              y: Math.random(),
              dy: (size / 2) * Math.random(),
              dx: (size / 2) * Math.random(),
            }
          })
        
          socket.emit('packet', JSON.stringify(circleData))
        
        }
      }
    })
  });
} catch(e) {
  console.log(new Error(e))
}

server.listen(3000);


// sudo node --inspect-brk index.js

// here's a map of the packet tree:
// https://en.wikipedia.org/wiki/OSI_model
//

// dc =(13*16) + (12*1) = 220
// 2**3,2**2, 2**1, 2**0
// 1100


// hexadecimal, each character represents a value between 0 and 15
// 0-9, a-f (a: 10, b: 11, c: 12, d: 13, e: 14, f: 15)

// 0x00 = 0
// 0x0F = 15
// 0x10 = 16
// 0xff = 255

// these are all equal:
// decimal: 220
// hexadecimal: 0xdc, 
// binary: 1101 1100

// colors are represented as "hex codes"
// RGB, RGBA (each of these could be any number in any range)
// (0..1), (0..100), (0..32)
// our color: (R G B) 0001 0110 1100

// https://en.wikipedia.org/wiki/8-bit_color

// 2^3 = 8 (R)
// 2^3 = 8 (G)
// 2^2 = 4 (B)
// 8 * 8 * 4 == 256 colors
// Bit    7  6  5  4  3  2  1  0
// Data   R  R  R  G  G  G  B  B

// 0xRRGGBBAA
// 0xf37dab00
// f3 7d ab 00
// 0110 1100 0110 1100 0110 1100 0110 1100 0000 0000

// white: 255 255 255 0
// FF FF FF 00
// 1111 1111 1111 1111 1111 1111 0000 0000
// 1 1 1 0

// f3
// 15 * 16 + 3 * 1
// 243
// 243 / 255 => 0.95
