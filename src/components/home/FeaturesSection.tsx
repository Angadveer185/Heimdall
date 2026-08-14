"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  QrCode,
  Building2,
  MapPin,
  Camera,
  Cookie,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      id: "atomic-lock",
      title: "Atomic Concurrency Lock",
      subtitle: "DATABASE TRANSACTION INTEGRITY",
      description:
        "Guarantees that two donors attempting to pledge the last sleeping bag simultaneously will never cause over-allocation or corrupt inventory balances.",
      icon: Lock,
      badge: "PRISMA $TRANSACTION",
      color: "text-neo-sun border-neo-sun",
    },
    {
      id: "qr-tickets",
      title: "Encrypted QR Drop-Off Pass",
      subtitle: "VERIFIABLE DONOR TICKETS",
      description:
        "Generates a unique QR ticket upon pledge. Donors scan their pass directly at shelter drop-off points for instant confirmation.",
      icon: QrCode,
      badge: "EXPIRED PASS HANDLER",
      color: "text-neo-gold border-neo-gold",
    },
    {
      id: "ein-verification",
      title: "501(c)(3) EIN Verification Queue",
      subtitle: "PROPUBLICA API INTEGRATION",
      description:
        "Super Admins verify shelter legitimacy by cross-referencing official IRS tax-exempt registration data before wishlists go live.",
      icon: Building2,
      badge: "PROPUBLICA LIVE",
      color: "text-neo-ink border-neo-ink",
    },
    {
      id: "urgency-radar",
      title: "Urgency Radar & Geo-Filtering",
      subtitle: "REAL-TIME LOGISTICS PRIORITIZATION",
      description:
        "Sort demands by urgency tags (CRITICAL, HIGH, MEDIUM) and distance, directing help where it's needed most in emergency situations.",
      icon: MapPin,
      badge: "CRITICAL ALERT RADAR",
      color: "text-neo-sun border-neo-sun",
    },
    {
      id: "impact-photo",
      title: "Impact Photo Receipts",
      subtitle: "PROOF-OF-FULFILLMENT LEDGER",
      description:
        "Shelter staff snap and attach proof photos upon scanning the drop-off QR pass, closing the loop and showing donors their real impact.",
      icon: Camera,
      badge: "PHOTO AUDIT TRAIL",
      color: "text-neo-gold border-neo-gold",
    },
    {
      id: "http-security",
      title: "Strict Cookie RBAC Security",
      subtitle: "SECURE HTTPONLY AUTH",
      description:
        "Tokens are stored strictly in httpOnly, Secure, SameSite=Strict cookies. Role-based access protects Donor, Shelter, and Admin desks.",
      icon: Cookie,
      badge: "httpOnly COOKIES",
      color: "text-neo-ink border-neo-ink",
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-20 bg-neo-rice text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-neo-line bg-neo-bg text-neo-ash font-label text-xs uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-neo-sun" />
            <span>OPERATIONAL CAPABILITIES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            Built for Extreme Logistics Precision
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            Every layer of Heimdall is engineered to enforce accountability, protect non-profit integrity, and give community donors absolute peace of mind.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-neo-bg border border-neo-line p-6 flex flex-col justify-between hover:border-neo-sun transition-all duration-300 group hover:-translate-y-1 shadow-sm"
              >
                <div className="space-y-4">
                  {/* Top Bar Icon & Badge */}
                  <div className="flex items-center justify-between border-b border-neo-line/30 pb-3">
                    <div className="w-10 h-10 bg-neo-rice border border-neo-line text-neo-sun flex items-center justify-center group-hover:bg-neo-sun group-hover:text-neo-rice transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-label text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border bg-neo-rice text-neo-ink">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <div className="space-y-1">
                    <span className="font-label text-[10px] text-neo-ash tracking-widest uppercase">
                      {feat.subtitle}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="font-body text-sm text-neo-ash leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Card Footnote Action */}
                <div className="mt-6 pt-3 border-t border-neo-line/30 flex items-center justify-between font-label text-[11px] text-neo-ash">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-neo-sun" /> VERIFIED MODULE
                  </span>
                  <span className="text-neo-ink font-bold group-hover:text-neo-sun flex items-center gap-0.5">
                    DETAILS <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
