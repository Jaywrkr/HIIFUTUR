import Link from "next/link";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { EditNameSection } from "@/components/EditNameSection";
import { requireUser } from "@/lib/session";

export default async function CuentaPage() {
  const user = await requireUser();

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader kicker="TU CUENTA" title="Mi cuenta" />

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Nombre</p>
          <div className="mb-4">
            <EditNameSection initialName={user.name ?? ""} />
          </div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Email</p>
          <p className="font-bold">{user.email}</p>
        </div>

        <div className="mb-10">
          <p className="section-title">Contraseña</p>
          <Link href="/forgot-password" className="link-accent text-sm">
            Cambiar mi contraseña
          </Link>
        </div>

        <div className="mb-10">
          <p className="section-title">Legal</p>
          <div className="flex flex-col gap-1">
            <Link href="/terminos" className="link-accent text-sm">Terminos de uso</Link>
            <Link href="/privacidad" className="link-accent text-sm">Politica de privacidad</Link>
          </div>
        </div>

        <div>
          <p className="section-title">Zona de riesgo</p>
          <DeleteAccountSection userEmail={user.email ?? ""} />
        </div>
      </main>
    </>
  );
}
