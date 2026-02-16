import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: SelectionStatus) {
    switch (status) {
        case "active":
            return <Badge variant="outline" className="border-emerald-500/10 text-emerald-500 bg-emerald-500/5">Active</Badge>
        case "draft":
            return <Badge variant="outline" className="border-gray-500/10 text-gray-500 bg-gray-500/5">Draft</Badge>
        case "disabled":
            return <Badge variant="outline" className="border-red-500/10 text-red-500 bg-red-500/5">Disabled</Badge>
    }
}

export function getToneBadge(tone: string) {
    switch (tone) {
        case "strict":
            return <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/5">Strict</Badge>
        case "neutral":
            return <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/5">Neutral</Badge>
        case "friendly":
            return <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 bg-indigo-500/5">Friendly</Badge>
        case "empathetic":
            return <Badge variant="outline" className="border-purple-500/30 text-purple-500 bg-purple-500/5">Empathetic</Badge>
    }
}