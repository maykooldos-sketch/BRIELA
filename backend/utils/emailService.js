const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderEmail = async (order, user) => {
  try {
    const mailOptions = {
      from: `"BRIELA EXCLUSIVE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      cc: process.env.EMAIL_RECEIVER,
      subject: `Confirmación de Pedido #${order._id.toString().slice(-6).toUpperCase()} - BRIELA`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="text-align: center; color: #000; letter-spacing: 2px;">BRIELA EXCLUSIVE</h2>
          <hr />
          <p>Hola <strong>${user.name}</strong>,</p>
          <p>Gracias por tu compra. Estamos preparando tu pieza con todo el cuidado para que llegue perfecta a tus manos.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <p><strong>Número de Pedido:</strong> #${order._id.toString().toUpperCase()}</p>
            <p><strong>Total Pago:</strong> $ ${order.total.toLocaleString('es-CO')} COP</p>
          </div>
          <p style="text-align: center; font-size: 0.8rem; color: #999;">BRIELA | El arte en cada pieza.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
};

const sendResetPasswordEmail = async (user, token) => {
  try {
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const mailOptions = {
      from: `"BRIELA EXCLUSIVE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Recuperación de Contraseña - BRIELA',
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="text-align: center; color: #000; letter-spacing: 2px;">BRIELA EXCLUSIVE</h2>
                    <hr />
                    <p>Hola <strong>${user.name}</strong>,</p>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 15px 25px; text-decoration: none; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em;">Restablecer Contraseña</a>
                    </div>
                    <p style="font-size: 0.8rem; color: #666;">Este enlace expirará en 1 hora.</p>
                    <p style="font-size: 0.8rem; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>
            `
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando email de reset:', error);
  }
};

const sendStatusUpdateEmail = async (order, user) => {
  try {
    const mailOptions = {
      from: `"BRIELA EXCLUSIVE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Actualización de tu Pedido #${order._id.toString().slice(-6).toUpperCase()} - BRIELA`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="text-align: center; color: #000; letter-spacing: 2px;">BRIELA EXCLUSIVE</h2>
                    <hr />
                    <p>Hola <strong>${user.name}</strong>,</p>
                    <p>Tu pedido ha cambiado de estado a: <strong style="text-transform: uppercase;">${order.status}</strong></p>
                    
                    ${order.status === 'enviado' ? `
                        <div style="background-color: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; margin: 20px 0;">
                            <p>🚚 <strong>Tu joya va en camino!</strong></p>
                            <p><strong>Transportadora:</strong> ${order.carrier}</p>
                            <p><strong>N° de Guía:</strong> ${order.trackingId}</p>
                        </div>
                    ` : ''}

                    ${order.status === 'entregado' ? `
                        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; text-align: center;">
                            <p>✨ <strong>¡Pedido Entregado!</strong> ✨</p>
                            <p>Esperamos que ames tu nueva pieza tanto como nosotros amamos crearla.</p>
                        </div>
                    ` : ''}

                    <p style="text-align: center; font-size: 0.8rem; color: #999; margin-top: 30px;">BRIELA | El arte en cada pieza.</p>
                </div>
            `
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error enviando actualización de estado:', error);
  }
};

module.exports = { sendOrderEmail, sendResetPasswordEmail, sendStatusUpdateEmail };
