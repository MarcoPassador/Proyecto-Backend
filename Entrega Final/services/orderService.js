import twilio from 'twilio';
import { createTransport } from 'nodemailer';
import { cartModel} from "../dbmodels/dbsConfig.js";
import { logger, loggerError } from "../utils/logger.js";
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = twilio(accountSid, authToken);
const ADMIN_NUMBER = process.env.ADMINNUMBER
const ADMIN_MAIL = process.env.ADMINMAIL

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILACC
  }
});

class OrderService {
    constructor(repository) {
        this.repository = repository;
    }

    async getOrders() {
        return this.repository.getElems()
    }

    async createOrder(orderData) {
        orderData.client.phone = +orderData.client.phone;
        console.log(orderData);
        const prodsHtml = orderData.order.products.map(prod => {
            return (`<li>${prod.name} Precio por unidad: ${prod.price} Cantidad ${prod.quantity} Total: ${prod.quantity * prod.price}</li>`)
          }).join(" ")

        return this.repository.createOrder(orderData)
        .then(async (newOrder) => {
             logger.info('Orden creada');
             const mailOptions = {
                from: 'Ropas Kitos',
                to: ADMIN_MAIL,
                subject: `Nuevo pedido de ${orderData.client.name} ${orderData.client.email}`,
                html: `
                <h1>Nuevo pedido</h1>
                <h2>Detalles de la orden y el usuario</h2>
                <h3>Usuario</h3>
                <ul>
                  <li>Nombre de usuario: ${orderData.client.username}</li>
                  <li>Nombre: ${orderData.client.name}</li>
                  <li>Email: ${orderData.client.email}</li>
                  <li>Teléfono: ${orderData.client.phone}</li>
                  <li>Direccion: ${orderData.client.address}</li>
                </ul>
                <h3>Orden de compra ${orderData.order.orderNo}</h3>
                <ul>
                  <h4>Productos:</h4>
                    ${prodsHtml}
                  <h4>Total a pagar: ${orderData.order.total}</h4>
                </ul>
                `
              }

              const mailToUser = {
                from: 'Ropas Kitos',
                  to: orderData.client.email,
                  subject: `Confirmacion de tu pedido, ${orderData.client.name} `,
                  html: `
                  <h1>Pedido confirmado</h1>
                  <h2>Detalles de la orden</h2>
                  <ul>
                    <li>Direccion de entrega: ${orderData.client.address}</li>
                    <h3>Orden de compra ${orderData.order.orderNo}</h3>
                    <h4>Productos:</h4>
                      ${prodsHtml}
                    <h4>Total a pagar: ${orderData.order.total}</h4>
                  </ul>
                  `
              }

            try {
              const message = await client.messages.create({
                  body: `Nuevo pedido de ${orderData.client.name} ${orderData.client.email}. Orden de compra ${orderData.order.orderNo}`,
                  from: 'whatsapp:+14155238886',
                  to: `${ADMIN_NUMBER}`,
              }).then(_ => logger.info('Nueva orden de compra'))
            } catch (error) {
              loggerError.error(error)
            }

            try {
                transporter.sendMail(mailOptions)
                transporter.sendMail(mailToUser)
            } catch (err) {
                loggerError.error(err)
            }

            cartModel.deleteOne({owner: orderData.owner})
            .then(_ => {
                logger.info('OK')
            })
            .catch(err => loggerError.error(err));

            console.log(newOrder);
            return newOrder;
        })
    }
}

export default OrderService;