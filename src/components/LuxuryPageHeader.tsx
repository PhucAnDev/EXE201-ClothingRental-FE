import { motion } from "motion/react";
import { ReactNode } from "react";

interface LuxuryPageHeaderProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  description: string;
  stats?: { value: string; label: string }[];
  children?: ReactNode;
}

export function LuxuryPageHeader({
  badge,
  title,
  titleAccent,
  subtitle,
  description,
  stats,
  children
}: LuxuryPageHeaderProps) {
  return (
    <section className="relative pt-32 pb-24 px-8 lg:px-12 bg-gradient-to-br from-[#1a1a1a] via-[#2d1a1a] to-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(193,39,45,0.3) 0%, transparent 70%)' }} />
      </div>

      {/* Vietnamese Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mb-8"
            >
              <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">{badge}</span>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2" />
            </motion.div>
          )}
          
          <motion.h1 
            className="text-6xl lg:text-7xl font-display text-white mb-6 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-gradient-gold italic">{titleAccent}</span>
              </>
            )}
            {subtitle && (
              <>
                <br />
                <span className="text-5xl lg:text-6xl text-white/90">{subtitle}</span>
              </>
            )}
          </motion.h1>
          
          <motion.p 
            className="text-white/70 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {description}
          </motion.p>

          {stats && stats.length > 0 && (
            <motion.div 
              className="flex justify-center items-center gap-16 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-4xl lg:text-5xl font-display text-gradient-gold mb-2 group-hover:scale-110 transition-transform duration-500">
                    {stat.value}
                  </div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
