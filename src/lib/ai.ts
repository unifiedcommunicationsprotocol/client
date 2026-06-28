/**
 * UCP Client AI Metadata Layer (Phase 6)
 * Local-only summaries, categories, and smart features
 * Never sends data to server or external AI service
 */

export interface ThreadMetadata {
  threadId: string;
  summary?: string;
  category?: "work" | "personal" | "urgent" | "archived";
  priority?: "high" | "normal" | "low";
  labels?: string[];
  sentiment?: "positive" | "neutral" | "negative";
  lastUpdated: number;
}

export interface MessageMetadata {
  messageId: string;
  tone?: "formal" | "casual" | "urgent";
  sentiment?: "positive" | "neutral" | "negative";
  keywords?: string[];
  actionItems?: string[];
  hasQuestion?: boolean;
  lastUpdated: number;
}

/**
 * Local AI metadata store
 * All processing happens client-side
 */
export function createAIMetadata() {
  const threadMetadata = new Map<string, ThreadMetadata>();
  const messageMetadata = new Map<string, MessageMetadata>();

  const setThreadMetadata = (metadata: ThreadMetadata): void => {
    threadMetadata.set(metadata.threadId, {
      ...metadata,
      lastUpdated: Date.now(),
    });
  };

  const getThreadMetadata = (threadId: string): ThreadMetadata | undefined => {
    return threadMetadata.get(threadId);
  };

  const setMessageMetadata = (metadata: MessageMetadata): void => {
    messageMetadata.set(metadata.messageId, {
      ...metadata,
      lastUpdated: Date.now(),
    });
  };

  const getMessageMetadata = (messageId: string): MessageMetadata | undefined => {
    return messageMetadata.get(messageId);
  };

  const updateThreadCategory = (
    threadId: string,
    category: "work" | "personal" | "urgent" | "archived",
  ): void => {
    const current = threadMetadata.get(threadId);
    if (current) {
      threadMetadata.set(threadId, {
        ...current,
        category,
        lastUpdated: Date.now(),
      });
    }
  };

  const addThreadLabel = (threadId: string, label: string): void => {
    const current = threadMetadata.get(threadId);
    if (current) {
      const labels = new Set(current.labels || []);
      labels.add(label);
      threadMetadata.set(threadId, {
        ...current,
        labels: Array.from(labels),
        lastUpdated: Date.now(),
      });
    }
  };

  const removeThreadLabel = (threadId: string, label: string): void => {
    const current = threadMetadata.get(threadId);
    if (current && current.labels) {
      const labels = current.labels.filter((l) => l !== label);
      threadMetadata.set(threadId, {
        ...current,
        labels,
        lastUpdated: Date.now(),
      });
    }
  };

  const setThreadSummary = (threadId: string, summary: string): void => {
    const current = threadMetadata.get(threadId);
    if (current) {
      threadMetadata.set(threadId, {
        ...current,
        summary,
        lastUpdated: Date.now(),
      });
    }
  };

  const detectActionItems = (plaintext: string): string[] => {
    // Simple client-side detection
    const actionPatterns = [
      /(?:^|\s)(?:TODO|FIXME|ACTION|TASK):\s*([^\n]+)/gim,
      /(?:^|\s)(?:Please|Can you|Could you|Would you)\s+([^\n.!?]+)[.!?]/gim,
    ];

    const items = new Set<string>();

    for (const pattern of actionPatterns) {
      const matches = plaintext.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          items.add(match[1].trim());
        }
      }
    }

    return Array.from(items);
  };

  const detectSentiment = (
    plaintext: string,
  ): "positive" | "neutral" | "negative" => {
    // Simple keyword-based sentiment (no ML)
    const positive =
      /\b(great|good|excellent|awesome|wonderful|happy|love|thanks|thank you)\b/i;
    const negative =
      /\b(bad|terrible|hate|awful|disappointing|angry|frustrated|upset)\b/i;

    const text = plaintext.toLowerCase();
    if (negative.test(text)) return "negative";
    if (positive.test(text)) return "positive";
    return "neutral";
  };

  const generateThreadSummary = (
    plaintext: string,
    maxLength = 200,
  ): string => {
    // Simple summary: first sentence + action items
    const sentences = plaintext.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return plaintext.slice(0, maxLength);

    let summary = sentences[0].trim();
    const actionItems = detectActionItems(plaintext);

    if (actionItems.length > 0) {
      const actions = actionItems.slice(0, 2).join("; ");
      summary += ` [Items: ${actions}]`;
    }

    return summary.slice(0, maxLength);
  };

  const clearAllMetadata = (): void => {
    threadMetadata.clear();
    messageMetadata.clear();
  };

  return {
    setThreadMetadata,
    getThreadMetadata,
    setMessageMetadata,
    getMessageMetadata,
    updateThreadCategory,
    addThreadLabel,
    removeThreadLabel,
    setThreadSummary,
    detectActionItems,
    detectSentiment,
    generateThreadSummary,
    clearAllMetadata,
  };
}

export type AIMetadata = ReturnType<typeof createAIMetadata>;
