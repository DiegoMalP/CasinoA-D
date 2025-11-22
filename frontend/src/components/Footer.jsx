import '../styles/Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="top">
                <div className="section">
                    <h3>Sobre Nosotros</h3>
                    <p>Casino Premium ofrece los mejores juegos en línea con seguridad y diversión garantizada. ¡Únete a nuestra comunidad de jugadores!</p>
                    <div className="socials">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaYoutube /></a>
                    </div>
                </div>

                <div className="section">
                    <h3>Enlaces Rápidos</h3>
                    <a href="#">Inicio</a>
                    <a href="#">Juegos</a>
                    <a href="#">Promociones</a>
                    <a href="#">Contacto</a>
                    <a href="#">Términos y Condiciones</a>
                </div>

            </div>

            <div className="bottom">
                <p>© 2025 Casino Premium. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
