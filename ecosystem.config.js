module.exports = {
  apps: [
    {
      name: "ClubVivamos",
      script: "npm",
      args: "start",
      max_memory_restart: "300M", //activar en caso de que haya un 502 con un límite de memoria
      instances: "4",
      exec_mode: "cluster",
      watch: ["components", "model", "pages", "redux", "src", "static"],
      ignore_watch: ["node_modules", "static/workbox"],
      watch_options: {
        followSymlinks: false,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3002,
        BASE_URL: "https://stg.clubvivamos.com",
        CLIENT_ID: "clubvivamos",
        GOOGLE_CLIENT_ID:
          "29076705810-urcs4kn56ucajbf99s8jrq9b9p5dj2qa.apps.googleusercontent.com",
        FACEBOOK_APP_ID: "449084425897337",
        COOKIE_PREFIX: "clubvivamos_development_", // cookie prefix
        COOKIES: JSON.stringify({
          SESSION: "auth",
          APP: "download_app",
          ALERT_HOME: "alert_home",
          ACCEPT_COOKIE: "accept_cookies"
        }),
        EMPTOR: JSON.stringify({
          BASIC_TOKEN: "Basic ZWx0aWVtcG9hbmRyb2lkbmF0aXZvOjdIeEViVmVnNjJ0NW9FYVRDaU1C",
          BASE_DOMAIN: "https://segbeta.eltiempo.com/",
          REGISTER: {
            BASIC: "v2/{CLIENT_ID}/user/create/source/default",
          },
          LOGIN: {
            BASIC: "v2/server/login/{CLIENT_ID}/password/basic/",
            GOOGLE: "v2/social/google-login/{CLIENT_ID}",
            FACEBOOK: "v2/social/facebook-login/{CLIENT_ID}",
          },
          LOGOUT: {
            BASIC: "v2/server/logout/{CLIENT_ID}",
          },
          RECOVERY: "v2/{CLIENT_ID}/user/reset",
          RECOVERY_PASS: "v2/{CLIENT_ID}/user/forget/pass",
          USER_ZONE: {
            UPDATE_USER: "v2/{CLIENT_ID}/user/edit",
            CHANGE_EMAIL: "v2/{CLIENT_ID}/user/change-email",
            CHANGE_PASSWORD: "v2/{CLIENT_ID}/user/reset/changepass",
          },
          ME: {
            ME: "v2/verifytoken",
          },
        }),
        BACO: JSON.stringify({
          "X-API-KEY": "cc0e7a6f7022c172d2a8aa0d951b5bda",
          BASE_DOMAIN: "https://movilidadapkpruebas.ceet.co/WebApiClubVivamos/",
          BENEFITS: {
            HEADQUARTERS: "v1/benefits/headquarters/",
            DETAIL: "v1/benefits/detail/",
            LIST: "v1/benefits/list",
            FEATURED: "v1/benefits/featured",
            FEATURED_BY_SEGMENT: "v1/benefits/homebanner/",
            SEGMENT: "v1/partner/segment",
            CUSTOM_BLOCKS: "v1/home/custombanner",
          },
        }),
        BACO_SAVINGS: JSON.stringify({
          "X-API-KEY": "2aa4c5e9845e7176fd9beae8813d38d981a9eb33269fb23717832bcfe9ba5783",
          BASE_DOMAIN: "https://movilidadapkpruebas.ceet.co/WebApiExtractosClub/",
          BASE_IMG_DOMAIN: "https://clubvivamos.ceet.co/club-suscriptores-api/",
          API: { SEARCH: 'api/Extractos/MiAhorro', METHOD: 'POST' }
        }),
        BACO_BENEFITS: JSON.stringify({
          "X-API-KEY": "ServBen16vAQK2mdRX5RXNd0Dr16on4QrgyTZvbTwVRGpvzop5lDSvnMQdoj6FQamIKzo1M2lrma2pKl08lnT51v5MQEGk7KNDfDIXTSsHjF9DTBwfsxeIoI7Y62odvG",
          BASE_DOMAIN: "https://movilidadapkpruebas.ceet.co/WebApiBeneficiarios/api/Beneficiario/",
          BASE_DOMAIN_SEGMENT: "https://movilidadapkpruebas.ceet.co/WebApiClubVivamos/v1/",
          ENDPOINTS: {
            INVITATION: "InvitacionBeneficiario",
            ENROLL: "InscripcionBeneficiario",
            QUANTITY: 'Cantidades',
            SEGMENT: "partner/segment",
          }
        }),
        GOOGLE: JSON.stringify({
          MAPS: {
            API_KEY: "AIzaSyBGb7arjzviNWwHBcIaKOpQVjxe3znrISU",
          },
          GTM: {
            CONTAINER_ID: "GTM-TFK4M7P",
          },
          RECAPTCHA: {
            SITE_KEY: "6LdXEbMcAAAAAD0EN6qWAGuAxmb_0rXw5xQxRFZd",
            ACTIVE: true,
          },
        }),
        SUSCRIPTION_NEWSLETTER: JSON.stringify({
          BASE_DOMAIN:
            "https://stg.clubvivamos.com/webform_rest/submit?_format=json",
          WEBFORM_ID: "newsletter",
          WEBFORM_KNOWCLUB: "quiero_el_club",
          TOKEN_URL: "https://stg.clubvivamos.com/rest/session/token",
        }),
        CMS: JSON.stringify({
          BASE_DOMAIN:
            "https://mtsstgelastic-cloud.es.privatelink.eastus2.azure.elastic-cloud.com:9243/elasticsearch_index_club_vivamos_beta_clubvivamos/_search?q=nid:",
          CONTENT_IMAGE_URL:
            "https://stg.clubvivamos.com/static/images/backend/",
          ABOUT: "2",
          FAQ: {
            1: "6",
            2: "10",
            3: "5",
            4: "4",
            5: "3",
          },
          BUTTON_SUBSCRIPTIONS: 14
        }),
        SAC: JSON.stringify({
          CHAT: {
            URL: "https://asistencia.webv2.allus.com.co/WebAPI802/ChatVivamos/AdvancedChat/bienvenido.jsp",
            ID: "_vivamos_eltiempo_chat",
          },
          TERMS: {
            URL: "http://mailpush.eltiempo.com/Terminos%20y%20condiciones/Politicas.pdf",
          },
          CONTACT_US: {
            URL: "https://eltiempo.zendesk.com/hc/es-419/requests/new",
          },
          PRIVACITY: {
            URL: "https://www.eltiempo.com/politica-privacidad",
          },
          ETHICAL_LINE: {
            URL: "https://www.ceet.co/linea-etica",
          },
          SUSCRIPTION: {
            URL: "https://suscripciones.eltiempo.com/?utm_source=Autopauta&utm_medium=clubvivamos_prp&utm_campaign=AutoPautaFija&utm_content=BotonFooterClub",
          },
          COLLECTIONS: {
            URL: "https://tienda.eltiempo.com",
          },
          REVERSION: {
            URL: "https://www.ceet.co/solicitud-reversion-de-pago",
          },
          UTILIZATIONS: {
            URL: "https://stg-aliados.clubvivamos.com",
          },
          DATA_POLICY: {
            URL: "https://www.eltiempo.com/politica-de-cookies",
          },
          PROCESSING_POLICY: {
            URL: "https://www.eltiempo.com/legal/POLITICA_DE_TRATAMIENTO_Y_PROCEDIMIENTOS_EN_MATERIA_DE_PROTECCION_DE_DATOS_PERSONALES.pdf",
          },
          AUTH: {
            URL: "https://www.eltiempo.com/legal/AUTORIZACION_DE_TRATAMIENTO_DE_DATOS_PERSONALES_CEET.pdf"
          },
        }),
        SALESFORCE: JSON.stringify({
          CONTACTUS: {
            URL: "https://cloud.mercadeoemaileltiempo.com/formularioclub",
          },
        }),
        ELASTIC_DATA: JSON.stringify({
          NODE: "https://mtsstgelastic-cloud.es.privatelink.eastus2.azure.elastic-cloud.com:9243/",
          INDEX: "elasticsearch_index_club_vivamos_beta_clubvivamos",
          DOMAIN: "http://stg-clubvivamos.eltiempo.com.co",
          ELASTIC_USERNAME: "MultiSite_Stg",
          ELASTIC_PASSWORD: "Mult1S1t3_Cl0ud_01",
        }),
        ELASTIC_DOMAIN: "https://stg-clubvivamos.eltiempo.com.co",
        NODE_ID: JSON.stringify({
          BUTTON_SUBSCRIPTIONS: 14
        }),
        MAIL_VALUES: JSON.stringify({
          FROM: "no-responder@ceetaz.com",
          HOST: "127.0.0.1",
          PORT: 25,
          API_KEY_WEB: "6b250dc2-86b6-450e-b057-dc59bfc1477d",
          API_KEY_APP: "e4ef786c-7e4a-41a8-b2ec-a6554dcb276e"
        }),
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
        BASE_URL: "https://www.clubvivamos.com",
        CLIENT_ID: "clubvivamos",
        GOOGLE_CLIENT_ID:
          "213111523721-sdli9o894acb396804e5c6c6gof33bj3.apps.googleusercontent.com",
        FACEBOOK_APP_ID: "449084425897337",
        COOKIE_PREFIX: "clubvivamos_", // cookie prefix
        COOKIES: JSON.stringify({
          SESSION: "auth",
          APP: "download_app",
          ALERT_HOME: "alert_home",
          ACCEPT_COOKIE: "accept_cookies"
        }),
        EMPTOR: JSON.stringify({
          BASIC_TOKEN: "Basic Y2x1YnZpdmFtb3M6ejZYalhmbVpVNE1EWFhIb01RNzk=",
          BASE_DOMAIN: "https://seg.eltiempo.com/",
          REGISTER: {
            BASIC: "v2/{CLIENT_ID}/user/create/source/default",
          },
          LOGIN: {
            BASIC: "v2/server/login/{CLIENT_ID}/password/basic/",
            GOOGLE: "v2/social/google-login/{CLIENT_ID}",
            FACEBOOK: "v2/social/facebook-login/{CLIENT_ID}",
          },
          LOGOUT: {
            BASIC: "v2/server/logout/{CLIENT_ID}",
          },
          RECOVERY: "v2/{CLIENT_ID}/user/reset",
          RECOVERY_PASS: "v2/{CLIENT_ID}/user/forget/pass",
          USER_ZONE: {
            UPDATE_USER: "v2/{CLIENT_ID}/user/edit",
            CHANGE_EMAIL: "v2/{CLIENT_ID}/user/change-email",
            CHANGE_PASSWORD: "v2/{CLIENT_ID}/user/reset/changepass",
          },
          ME: {
            ME: "v2/verifytoken",
          },
        }),
        BACO: JSON.stringify({
          "X-API-KEY": "cc0e7a6f7022c172d2a8aa0d951b5bda",
          BASE_DOMAIN: "https://clubvivamos.ceet.co/club-suscriptores-api/",
          BENEFITS: {
            HEADQUARTERS: "v1/benefits/headquarters/",
            DETAIL: "v1/benefits/detail/",
            LIST: "v1/benefits/list",
            FEATURED: "v1/benefits/featured",
            FEATURED_BY_SEGMENT: "v1/benefits/homebanner/",
            SEGMENT: "v1/partner/segment",
            CUSTOM_BLOCKS: "v1/home/custombanner",
          },
        }),
        BACO_SAVINGS: JSON.stringify({
          "X-API-KEY": "2aa4c5e9845e7176fd9beae8813d38d981a9eb33269fb23717832bcfe9ba5783",
          BASE_DOMAIN: "https://movilidad.ceet.co/WebApiExtractosClub/",
          BASE_IMG_DOMAIN: "https://clubvivamos.ceet.co/club-suscriptores-api/",
          API: { SEARCH: 'api/Extractos/MiAhorro', METHOD: 'POST' }
        }),
        BACO_BENEFITS: JSON.stringify({
          "X-API-KEY": "ServBen16vAQK2mdRX5RXNd0Dr16on4QrgyTZvbTwVRGpvzop5lDSvnMQdoj6FQamIKzo1M2lrma2pKl08lnT51v5MQEGk7KNDfDIXTSsHjF9DTBwfsxeIoI7Y62odvG",
          BASE_DOMAIN: "https://movilidad.ceet.co/WebApiBeneficiarios/api/Beneficiario/",
          BASE_DOMAIN_SEGMENT: "https://clubvivamos.ceet.co/club-suscriptores-api/v1/",
          ENDPOINTS: {
            INVITATION: "InvitacionBeneficiario",
            ENROLL: "InscripcionBeneficiario",
            QUANTITY: 'Cantidades',
            SEGMENT: "partner/segment",
          }
        }),
        GOOGLE: JSON.stringify({
          MAPS: {
            API_KEY: "AIzaSyC_7UrkXClCYuwWQ3HL5eoGZZItzPG8-60",
          },
          GTM: {
            CONTAINER_ID: "GTM-W6ND5LN",
          },
          RECAPTCHA: {
            SITE_KEY: "6LcmqbYUAAAAAC2pxWD_wzixwMZkIG4vlrT4L_EQ",
            ACTIVE: true,
          },
        }),
        SUSCRIPTION_NEWSLETTER: JSON.stringify({
          BASE_DOMAIN:
            "https://www.clubvivamos.com/webform_rest/submit?_format=json",
          WEBFORM_ID: "newsletter",
          WEBFORM_KNOWCLUB: "quiero_el_club",
          TOKEN_URL: "https://www.clubvivamos.com/rest/session/token",
        }),
        CMS: JSON.stringify({
          BASE_DOMAIN:
            "https://transprdelastic-cloud.es.privatelink.eastus2.azure.elastic-cloud.com:9243/elasticsearch_index_club_vivamos_clubvivamos/_search?q=nid:",
          CONTENT_IMAGE_URL:
            "https://www.clubvivamos.com/static/images/backend/",
          ABOUT: "2",
          FAQ: {
            1: "6",
            2: "10",
            3: "5",
            4: "4",
            5: "3",
          },
          BUTTON_SUBSCRIPTIONS: 15
        }),
        SAC: JSON.stringify({
          CHAT: {
            URL: "https://asistencia.webv2.allus.com.co/WebAPI802/ChatVivamos/AdvancedChat/bienvenido.jsp",
            ID: "_vivamos_eltiempo_chat",
          },
          TERMS: {
            URL: "http://mailpush.eltiempo.com/Terminos%20y%20condiciones/Politicas.pdf",
          },
          CONTACT_US: {
            URL: "https://eltiempo.zendesk.com/hc/es-419/requests/new",
          },
          PRIVACITY: {
            URL: "https://www.eltiempo.com/politica-privacidad",
          },
          ETHICAL_LINE: {
            URL: "https://www.ceet.co/linea-etica",
          },
          SUSCRIPTION: {
            URL: "https://suscripciones.eltiempo.com/?utm_source=Autopauta&utm_medium=clubvivamos_prp&utm_campaign=AutoPautaFija&utm_content=BotonFooterClub",
          },
          COLLECTIONS: {
            URL: "https://tienda.eltiempo.com",
          },
          REVERSION: {
            URL: "https://www.ceet.co/solicitud-reversion-de-pago",
          },
          UTILIZATIONS: {
            URL: "https://aliados.clubvivamos.com/",
          },
          DATA_POLICY: {
            URL: "https://www.eltiempo.com/politica-de-cookies",
          },
          PROCESSING_POLICY: {
            URL: "https://www.eltiempo.com/legal/POLITICA_DE_TRATAMIENTO_Y_PROCEDIMIENTOS_EN_MATERIA_DE_PROTECCION_DE_DATOS_PERSONALES.pdf",
          },
          AUTH: {
            URL: "https://www.eltiempo.com/legal/AUTORIZACION_DE_TRATAMIENTO_DE_DATOS_PERSONALES_CEET.pdf"
          }
        }),
        SALESFORCE: JSON.stringify({
          CONTACTUS: {
            URL: "https://cloud.mercadeoemaileltiempo.com/formularioclub",
          },
        }),
        ELASTIC_DATA: JSON.stringify({
          NODE: "https://transprdelastic-cloud.es.privatelink.eastus2.azure.elastic-cloud.com:9243/",
          INDEX: "elasticsearch_index_club_vivamos_clubvivamos",
          DOMAIN: "https://clubvivamos.eltiempo.com.co",
          ELASTIC_USERNAME: "MultiSite_Prod",
          ELASTIC_PASSWORD: "*Mult1S1t3_Pr0d24*",
        }),
        ELASTIC_DOMAIN: "https://clubvivamos.eltiempo.com.co",
        MAIL_VALUES: JSON.stringify({
          FROM: "no-responder@eltiempo.com",
          HOST: "127.0.0.1",
          PORT: 25,
          API_KEY_WEB: "6b250dc2-86b6-450e-b057-dc59bfc1477d",
          API_KEY_APP: "e4ef786c-7e4a-41a8-b2ec-a6554dcb276e"
        })
      },
    },
  ],
};
