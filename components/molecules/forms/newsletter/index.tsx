/**
 * Boletín del Home — fiel a producción (_newsletter.scss):
 * caja gris #f7f7f7 (max-w 970), título BarlowCondensed 24px, input + botón rojo
 * solapado, checkboxes MavenPro 12px (#434343) con links #1e73c2.
 * Presentacional: el envío (useWebForm) se cablea aparte.
 */
const Newsletter = () => {
  return (
    <section className="w-full bg-white pb-[50px] mobile:px-8">
      <div className="mx-auto max-w-[970px] bg-[#f7f7f7] px-4 py-6 text-center">
        {/* Título — BarlowCondensed-SemiBold 24px */}
        <h2 className="mx-auto max-w-[873px] py-6 font-barlow text-[24px] font-semibold text-ink">
          Sé el primero en recibir la información sobre ofertas y promociones de temporada
        </h2>

        {/* Form: input (izq) + botón rojo solapado (der) */}
        <form className="mx-auto flex max-w-[680px] flex-col items-stretch justify-center gap-2 mobile:flex-row mobile:gap-0">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            required
            className="h-9 w-full rounded-[4px] border border-gray-line bg-white px-4 font-maven text-[14px] text-gray-2 outline-none focus:border-primary mobile:w-[65%] mobile:rounded-r-none"
          />
          <button
            type="submit"
            className="h-9 rounded-[20px] bg-danger px-6 font-maven text-[16px] text-white transition hover:brightness-90 mobile:-ml-5"
          >
            Suscribirme al boletín
          </button>
        </form>

        {/* Checkboxes legales — MavenPro 12px / #434343, links #1e73c2 */}
        <div className="mx-auto mt-4 max-w-[91%] space-y-1 text-left">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              className="mt-1 h-[18px] w-[18px] shrink-0 accent-danger"
            />
            <span className="font-maven text-[12px] leading-[28px] text-gray-2">
              Autorizo el tratamiento de mis datos personales conforme con las{" "}
              <a href="/aviso-de-privacidad" className="text-info no-underline hover:underline">
                políticas de privacidad
              </a>{" "}
              y datos de{" "}
              <a href="#" className="text-info no-underline hover:underline">
                Navegación / cookies
              </a>{" "}
              de EL TIEMPO, las cuales he leído y entendido.
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 h-[18px] w-[18px] shrink-0 accent-danger" />
            <span className="font-maven text-[12px] leading-[28px] text-gray-2">
              Autorizo el envío de información comercial y promocional diferente a la relacionada con el
              bien o servicio adquirido.{" "}
              <a href="#" className="text-info no-underline hover:underline">
                Encuesta
              </a>
            </span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
