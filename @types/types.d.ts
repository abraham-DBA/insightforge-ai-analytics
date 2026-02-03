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