"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [regalos, setRegalos] = useState<any[]>([]);

  async function cargarRegalos() {
    const { data } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false });

    setRegalos(data || []);
  }

  useEffect(() => {
    cargarRegalos();
  }, []);

  async function guardarRegalo() {
    if (!nombre || !descripcion || !foto) {
      alert("Completa todos los campos");
      return;
    }

    setCargando(true);

    const nombreArchivo = Date.now() + "-" + foto.name;

    const subida = await supabase.storage
      .from("gift-images")
      .upload(nombreArchivo, foto);

    if (subida.error) {
      alert("Error subiendo imagen");
      setCargando(false);
      return;
    }

    const { data } = supabase.storage
      .from("gift-images")
      .getPublicUrl(nombreArchivo);

    const insertar = await supabase.from("gifts").insert([
      {
        nombre,
        descripcion,
        foto_url: data.publicUrl,
        regalado: false,
      },
    ]);

    if (insertar.error) {
      alert("Error guardando regalo");
      setCargando(false);
      return;
    }

    alert("Regalo guardado");

    setNombre("");
    setDescripcion("");
    setFoto(null);
    setCargando(false);
    cargarRegalos();
  }

  async function eliminarRegalo(id: string) {
    const confirmar = confirm("¿Eliminar regalo?");

    if (!confirmar) return;

    await supabase.from("gifts").delete().eq("id", id);

    cargarRegalos();
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] p-6 text-[#3f352b]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-center text-4xl font-semibold">
          Panel de regalos
        </h1>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-medium">Nombre del regalo</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <button
            onClick={guardarRegalo}
            disabled={cargando}
            className="w-full rounded-full bg-[#8b735c] py-4 text-white disabled:bg-gray-400"
          >
            {cargando ? "Guardando..." : "Guardar regalo"}
          </button>
        </div>

        <hr className="my-10" />

        <h2 className="mb-6 text-2xl font-semibold">Regalos registrados</h2>

        <div className="space-y-4">
          {regalos.length === 0 ? (
            <p className="text-gray-500">Aún no hay regalos registrados.</p>
          ) : (
            regalos.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border p-4"
              >
                <div>
                  <p className="font-semibold">{item.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {item.regalado ? "Regalado" : "Disponible"}
                  </p>
                </div>

                <button
                  onClick={() => eliminarRegalo(item.id)}
                  className="rounded-full bg-red-500 px-4 py-2 text-white"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
