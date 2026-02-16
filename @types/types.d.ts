type SourceType = "website" | "docs" | "upload" | "text";
type SourceStatus = "active" | "training" | "error" | "excluded";

interface KnowledgeSource {
    id: string;
    user_email: string,
    type: SourceType,
    name: string;
    status: string;
    source_url: string | null;
    content: string | null;
    metadata: string | null;
    last_updated_at: string | null;
    created_at: string | null;
}

type SelectionStatus = "active" | "draft" | "disabled"
type Tone = "strict" | "neutral" | "friendly" | "empathetic"

interface SectionFormData {
    name: string,
    description: string,
    tone: Tone,
    allowedTopics?: string,
    blockedTopics?: string,
    fallbackBehaviour: string
}

interface Section {
    id: string,
    name: string,
    description: string,
    sourceCount: number,
    source_ids?: string[],
    tone: Tone,
    scopeLabel: string,
    allowedTopics?: string,
    blockedTopics?: string,
    status: SelectionStatus,
}