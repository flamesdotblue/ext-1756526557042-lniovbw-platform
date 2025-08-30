import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function HeroCover({ onQuickCreate }) {
  return (
    <section className="relative h-[360px] md:h-[420px] w-full">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white pointer-events-none" />
      <div className="relative z-0 h-full flex items-center">
        <div className="px-4 md:px-8 w-full">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium border">
            <Rocket className="h-3.5 w-3.5 text-rose-600" />
            Unified UTM Workspace
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight max-w-3xl">
            Build, manage, and analyze campaign tracking links in one place
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            Create UTM templates, generate consistent URLs, and compare performance across channels with production-ready tooling.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onQuickCreate}
              className="inline-flex items-center rounded-lg bg-rose-600 text-white px-4 py-2 text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Quick Create UTM
            </button>
            <button className="inline-flex items-center rounded-lg border bg-white/80 backdrop-blur px-4 py-2 text-sm font-medium hover:bg-white">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
