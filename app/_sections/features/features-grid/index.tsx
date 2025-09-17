import { BaseHubImage } from "basehub/next-image";
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Search, 
  Rocket, 
  Bell,
  LucideIcon
} from "lucide-react";

import { Heading } from "../../../../common/heading";
import { Section } from "../../../../common/section-wrapper";
import { fragmentOn } from "basehub";
import { buttonFragment, headingFragment } from "../../../../lib/basehub/fragments";
import { TrackedButtonLink } from "../../../../components/tracked-button";
import { GeneralEvents } from "../../../../lib/basehub/fragments";

export const featuresGridFragment = fragmentOn("FeaturesGridComponent", {
  _analyticsKey: true,
  featuresGridList: {
    items: {
      _id: true,
      _title: true,
      description: true,
      icon: {
        alt: true,
        url: true,
      },
    },
  },
  heading: headingFragment,
  actions: buttonFragment,
});

type FeaturesGrid = fragmentOn.infer<typeof featuresGridFragment>;

const iconMap: Record<string, LucideIcon> = {
  "chart-line": TrendingUp,
  "flame": Flame,
  "clock": Clock,
  "search": Search,
  "rocket": Rocket,
  "bell": Bell,
};

export function FeaturesGrid({
  heading,
  featuresGridList,
  actions,
  eventsKey,
  onActionClick,
}: FeaturesGrid & { eventsKey: GeneralEvents["ingestKey"]; onActionClick?: (action?: any) => void }) {
  return (
    <Section>
      <Heading {...heading}>
        <h4>{heading.title}</h4>
      </Heading>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        {featuresGridList.items.map(({ _id, _title, description, icon }) => {
          const IconComponent = typeof icon === 'string' ? iconMap[icon] : null;
          const hasImageIcon = icon && typeof icon === 'object' && icon.url;
          
          return (
            <article
              key={_id}
              className="group relative flex flex-col gap-4 rounded-lg border border-[--border] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:border-[--dark-border] dark:hover:border-primary/50 dark:hover:shadow-primary/20 dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {(IconComponent || hasImageIcon) && (
                <figure className="relative z-10 flex size-9 items-center justify-center rounded-full border border-[--border] bg-[--surface-secondary] p-2 transition-transform duration-300 group-hover:scale-110 dark:border-[--dark-border] dark:bg-[--dark-surface-secondary]">
                  {IconComponent ? (
                    <IconComponent className="size-[18px] text-[--text-primary] dark:text-[--dark-text-primary]" />
                  ) : hasImageIcon ? (
                    <BaseHubImage
                      alt={icon.alt ?? _title}
                      className="dark:invert"
                      height={18}
                      src={icon.url}
                      width={18}
                    />
                  ) : null}
                </figure>
              )}
              <div className="relative z-10 flex flex-col items-start gap-1">
                <h5 className="text-lg font-medium transition-colors duration-300 group-hover:text-primary">{_title}</h5>
                <p className="text-pretty text-[--text-secondary] transition-colors duration-300 group-hover:text-[--text-primary] dark:text-[--dark-text-secondary] dark:group-hover:text-[--dark-text-primary]">
                  {description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-3 md:order-3">
        {actions?.map((action) => (
          <button
            key={action._id}
            onClick={() => onActionClick?.(action)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              action.type === "primary"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-[--border] dark:border-[--dark-border] bg-background hover:bg-muted"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </Section>
  );
}
