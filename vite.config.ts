import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv('production', process.cwd(), ''),
    ...loadEnv(mode, process.cwd(), ''),
    ...process.env,
  };

  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://dqwxqqdyesytzlkybmlt.supabase.co';
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_VGS5tKUakbo0L8kyHRUjUw_Lw3yfLDI';
  const mathbotUrl = env.VITE_MATHBOT_URL || 'https://vutrutoanhoc.vercel.app/api/mathbot';

  return {
    base: '/vutrutoanhoctest4/',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseKey),
      'import.meta.env.VITE_MATHBOT_URL': JSON.stringify(mathbotUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
