"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Gift = {
  id: string;
  nombre: string;
  descripcion: string;
  foto_url: string;
  regalado: boolean;
};

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);

  async function cargarRegalos() {
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error cargando regalos");
      return;
    }

    setGifts(data || []);
  }

  async function regalar(id:string){

const nombrePersona=prompt("Ingresa tu nombre");

if(!nombrePersona) return;

const mensaje=prompt("Déjanos un mensaje (opcional)") || "";

const { error } = await supabase
.from("gifts")
.update({
regalado:true,
regalado_por:nombrePersona,
mensaje:mensaje,
fecha_regalo:new Date()
})
.eq("id",id);

if(error){
alert("No se pudo reservar el regalo");
return;
}

alert("¡Gracias por tu regalo!");

cargarRegalos();

}

  useEffect(() => {
    cargarRegalos();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#3f352b]">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm tracking-[0.35em] text-[#8b735c]">
          HOME SHOWER
        </p>

        <h1 className="mb-4 text-4xl font-semibold md:text-6xl">
          María & Erick
        </h1>

        <p className="mb-6 max-w-xl text-lg text-[#6f5d4d]">
          Nos haría ilusión que seas parte de este nuevo comienzo.
        </p>

        <div className="mb-8 rounded-2xl bg-white/70 px-6 py-5 shadow-sm">
          <p className="font-medium">Sábado 02/05 · 3:00 p. m.</p>
          <p className="mt-2 text-sm text-[#6f5d4d]">
            Av. Del Pacífico 175, Condominio Parques de la Huaca, San Miguel
          </p>
        </div>

        <a
          href="#lista"
          className="rounded-full bg-[#8b735c] px-8 py-3 text-white shadow-md transition hover:bg-[#735f4d]"
        >
          Ver lista de deseos
        </a>
      </section>

      <section id="lista" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-semibold">
            Lista de deseos
          </h2>

          <p className="mb-10 text-center text-[#6f5d4d]">
            Elige uno o más regalos para acompañarnos en este nuevo comienzo.
          </p>

          {gifts.length === 0 ? (
            <p className="text-center text-[#6f5d4d]">
              Aún no hay regalos registrados.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className={`relative overflow-hidden rounded-3xl bg-white shadow-sm ${
                    gift.regalado ? "opacity-50 grayscale" : ""
                  }`}
                >
                  {gift.regalado && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-[#3f352b] px-4 py-2 text-xs font-bold tracking-widest text-white">
                      REGALADO
                    </div>
                  )}

                  <img
                    src={gift.foto_url}
                    alt={gift.nombre}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{gift.nombre}</h3>

                    <p className="mt-2 text-sm text-[#6f5d4d]">
                      {gift.descripcion}
                    </p>

                    <button
disabled={gift.regalado}
onClick={()=>regalar(gift.id)}
className="mt-5 w-full rounded-full bg-[#8b735c] px-5 py-3 text-white transition hover:bg-[#735f4d] disabled:cursor-not-allowed disabled:bg-gray-400"
>
{gift.regalado ? "Ya fue regalado" : "Elegir regalo"}
</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}