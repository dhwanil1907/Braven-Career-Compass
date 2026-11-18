import { ChatPanel } from '../components/ChatPanel';
import { PageHeader } from '../components/PageHeader';

export function AssistantPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Assistant"
        title="Ask Career Compass"
        description="Questions about Braven, this site, companies, or your career search. It can point you to real listings on the site."
      />
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <ChatPanel />
      </div>
    </div>
  );
}
