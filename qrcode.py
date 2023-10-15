import segno

qr = segno.make_qr("https://mp3youtube.vercel.app/watch/?v=i0_m90T04uw")
qr.save('newqrcode.png',
        scale=8,
        border=1,
        light="#ffffff00",
        dark="green",


        
        )