## Crafy Web Engine

Crafy Web Engine es una extensión de soporte para las plataformas web desarrolladas por Crafy Holding, como BitBook Lite y SocialNC (Xablyte).  
Esta extensión sirve como medio de comunicación entre los servicios de Crafy Holding y añade funcionalidades a los mismos.  
Al instalar Crafy Web Engine podrás obtener acceso a nuevas funciones dentro de los servicios de Crafy Holding, como herramientas de Inteligencia Artificial, ejecución en segundo plano, etc.

### Instalación

Puedes ver todas las funciones de Crafy Web Engine e instalarlo en tu navegador desde su web oficial: [https://chijete.com/CrafyWebEngine/](https://chijete.com/CrafyWebEngine/)

### Open Source

Hemos decidido hacer que el código fuente de Crafy Web Engine sea de código abierto.

De esta forma cualquier persona puede consultar de forma pública y gratuita el código fuente de la extensión Crafy Web Engine, y así auditarla o utilizar sus funciones para otros proyectos.

### Estructura del repositorio

*   **extension**: código fuente de la extensión.
    *   **background.js**: Service Worker de la extensión.
    *   **chatgpt.js**: una copia interna de [https://github.com/KudoAI/chatgpt.js](https://github.com/KudoAI/chatgpt.js)
    *   **content.js**: script que se inyecta a las webs objetivo, por ejemplo, chatgpt.com
    *   **icon.png**: ícono de la extensión.
    *   **manifest.json**: manifiesto de la extensión.
*   **packages**: paquetes finales de cada versión de la extensión en formato ZIP.
*   **test**: página de prueba de las funciones de la extensión; es el código fuente de esta página: [https://chijete.com/CrafyWebEngine/test/](https://chijete.com/CrafyWebEngine/test/)
