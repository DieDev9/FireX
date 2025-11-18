'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Flame, Shield, Wrench, TrendingUp, CheckCircle, Clock, Award, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 py-24 md:py-32">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05]" />

          <div className="absolute top-20 left-10 h-72 w-72 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-20 right-10 h-96 w-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

          <div className="container relative mx-auto px-4">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-primary text-sm font-medium mb-6 border border-primary/20 animate-shimmer">
                <Shield className="h-4 w-4" />
                Certificación Internacional
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 leading-tight">
                Protección Contra Incendios de{' '}
                <span className="gradient-text animate-glow">Excelencia</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground text-balance mb-10 leading-relaxed max-w-2xl mx-auto">
                Equipos de última generación y servicios profesionales de recarga. Tu seguridad es nuestra prioridad absoluta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300 text-base px-8 shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link href="/productos">
                    <Shield className="mr-2 h-5 w-5" />
                    Ver Catálogo
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 border-2 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/servicios">
                    <Wrench className="mr-2 h-5 w-5" />
                    Solicitar Servicio
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Certificado ISO 9001</span>
                </div>
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Servicio 24/7</span>
                </div>
                <div className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
                  <Award className="h-5 w-5 text-primary" />
                  <span>+10 años de experiencia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Nuestras Ventajas
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
                ¿Por qué elegir <span className="gradient-text">FireX</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Líderes en equipos de seguridad con certificación internacional
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group animate-scale-in overflow-hidden relative" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Shield className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Equipos Certificados</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Todos nuestros productos cumplen con las normas internacionales ISO y están respaldados por garantía total.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group animate-scale-in overflow-hidden relative" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Wrench className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Servicio Técnico</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Recarga y mantenimiento profesional con técnicos certificados y seguimiento en tiempo real de tu solicitud.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group animate-scale-in overflow-hidden relative" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <TrendingUp className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Mejor Precio</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Calidad profesional a precios competitivos. Invertir en seguridad nunca fue tan accesible y confiable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-400/[0.05]" />
          <div className="container mx-auto px-4 relative">
            <Card className="border-2 border-primary/20 overflow-hidden shadow-2xl animate-scale-in bg-gradient-to-br from-card via-card to-muted/30">
              <div className="relative p-12 md:p-16 text-center overflow-hidden">
                {/* Efectos de fondo mejorados */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
                <div className="absolute top-10 left-20 h-40 w-40 bg-primary/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-10 right-20 h-52 w-52 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 animate-glow shadow-xl">
                    <Flame className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                    ¿Necesitas <span className="gradient-text">recargar</span> tu extintor?
                  </h2>
                  <p className="text-lg mb-10 text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
                    Programa tu servicio de recarga y mantenimiento. Proceso rápido, confiable y con seguimiento en tiempo real.
                  </p>
                  <Button
                    size="lg"
                    className="text-base px-8 bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300 shadow-2xl text-primary-foreground"
                    asChild
                  >
                    <Link href="/servicios">
                      Solicitar Servicio Ahora
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-card relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Flame className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Fire<span className="gradient-text">X</span></span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FireX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
