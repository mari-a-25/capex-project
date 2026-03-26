import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import './FloatingChat.css';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <motion.button
        type="button"
        className="floating-chat-btn"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Abrir ayuda"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-popup"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            <div className="chat-header">
              <h4>¿Necesitas ayuda?</h4>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar ayuda">
                ✕
              </button>
            </div>
            <div className="chat-body">
              <p>
                Escríbenos por WhatsApp para consultas rápidas o déjanos un mensaje y te contactamos.
              </p>
              <div className="chat-actions">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  WhatsApp
                </a>
                <Link to="/contacto" className="btn btn-sm btn-outline">
                  Contacto
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;

