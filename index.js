const pcap = require('pcap')
const session = pcap.createSession();
const server = require('http').createServer();
const io = require('socket.io')(server);

let alphabet = [...Array(26)].map((_, y) => String.fromCharCode(y + 65))
alphabet.forEach( capital_letter => alphabet.push(capital_letter.toLowerCase()))

io.on('connection', socket => {

  session.on('packet', raw_packet => {
    const packet = pcap.decode.packet(raw_packet)
    const payload = packet.payload.payload.payload

    if (payload && payload.constructor.name === "TCP"){
      const { data } = payload

      if (data !== null ) {
        const buffer = Buffer.byteLength(data)
        console.log(data.toString())
        let buffArr = data
          .toString("utf-8", 0, buffer)
          .trim()
          .split('')
          .filter( i => alphabet.includes(i))

          const lePacket = {
            size: buffer,
            data: buffArr,
          }

          socket.emit('packet', JSON.stringify(lePacket))
        }
      }
  })
});


server.listen(3000);





