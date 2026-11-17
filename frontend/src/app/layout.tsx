import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Synergy & Work Operating Manual (BaZi + MBTI + RACI)",
  description:
    "คู่มือการทำงานร่วมกันในทีมและวิเคราะห์เคมีเพื่อนร่วมงานด้วยโครงสร้างปฏิทินสุริยคติ (BaZi) + MBTI Cognitive Functions + RACI Matrix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = sessionStorage.getItem('team_synergy_theme');
                  var isDark = saved === 'dark' || (!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
