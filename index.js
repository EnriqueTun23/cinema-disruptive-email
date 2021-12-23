const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors')

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/form", (req, res) => {
    nodemailer.createTestAccount((err, account) => {
        // Creacion del email
        const htmlEmail = `
        <div>
            <img src=${req.body.img} alt="prueba" />
        </div>
        <h1>${req.body.title}</h1>
        <p>
            <b>Fecha de estreno:</b> ${req.body.date}
        </p>
      `;
      // configuracion del envio del email con gmail
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "projects.midsoftware@gmail.com", //El email del servicio SMTP que va a utilizar (en este caso Gmail)
                pass: "rootpassword+" // La contraseña de dicho SMTP
            }
        });
        // El asunto del email, para quien esta dirigido y quien lo envia
        let mailOptions = {
            from: "projects.midsoftware@gmail.com", // Quien manda el email
            to: req.body.email, // El email de destino
            replyTo: "projects.midsoftware@gmail.com",
            subject: req.body.title, // El asunto del email
            text: req.body.title, // El mensaje
            html: htmlEmail // La parte HTML del email
        };
        // Envio del email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err);
            }
            console.log("Mensaje enviado: %s", info.mensaje);
            console.log("Url del mensaje: %s", nodemailer.getTestMessageUrl(info));
        });
    });
    // respuesta de exito
    res.status(200).json({
        ok: true,
        mensaje: 'Email enviado correctamente'
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor a la escucha en el puerto ${PORT}`);
});

