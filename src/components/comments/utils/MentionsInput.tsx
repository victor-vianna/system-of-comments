import React, { ChangeEvent, KeyboardEvent, useRef } from "react";

export interface Mention {
  id: string;
  display: string;
  startPosition: number;
  endPosition: number;
}

interface MentionsInputProps {
  value: string;
  mentions: Mention[];
  suggestions?: string[];
  onMention?: (mention: Mention) => void;
  onChange: (value: string) => void;
  onMentionsChange: (mentions: Mention[]) => void;
  placeholder?: string;
  maxHeight?: number;
  className?: string;
}

interface MentionState {
  searchTerm: string;
  startPosition: number;
  endPosition: number;
}

const MentionsInput: React.FC<MentionsInputProps> = ({
  value,
  mentions,
  suggestions = [],
  onMention = () => {
    console.log();
  },
  onChange,
  onMentionsChange,
  placeholder = "Comente ou digite '@' para mencionar alguém...",
  maxHeight = 150,
  className = "",
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  const [mentionState, setMentionState] = React.useState<MentionState | null>(
    null,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Filter suggestions based on search term
  const filteredSuggestions = suggestions.filter((suggestion) =>
    mentionState
      ? suggestion.toLowerCase().includes(mentionState.searchTerm.toLowerCase())
      : false,
  );

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    const previousLength = value.length;
    const isDeleting = newValue.length < previousLength;

    // Handle mention removal
    if (isDeleting) {
      const deletedMentions = findDeletedMentions(value, newValue, mentions);
      if (deletedMentions.length > 0) {
        const updatedMentions = recalculateMentionPositions(
          mentions.filter((mention) => !deletedMentions.includes(mention)),
          value,
          newValue,
          cursorPosition,
        );
        onMentionsChange(updatedMentions);
      }
    }

    onChange(newValue);

    // Find the @ symbol before the cursor
    const beforeCursor = newValue.slice(0, cursorPosition);
    const atSymbolIndex = beforeCursor.lastIndexOf("@");

    if (atSymbolIndex !== -1) {
      const textAfterAt = beforeCursor.slice(atSymbolIndex + 1);
      const hasSpaceAfterAt = textAfterAt.includes(" ");

      if (
        !hasSpaceAfterAt &&
        atSymbolIndex === beforeCursor.length - textAfterAt.length - 1
      ) {
        setMentionState({
          searchTerm: textAfterAt,
          startPosition: atSymbolIndex,
          endPosition: cursorPosition,
        });
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setMentionState(null);
      }
    } else {
      setShowSuggestions(false);
      setMentionState(null);
    }
  };

  // Helper function to find mentions that were deleted
  const findDeletedMentions = (
    oldValue: string,
    newValue: string,
    currentMentions: Mention[],
  ): Mention[] => {
    return currentMentions.filter((mention) => {
      const mentionText = oldValue.slice(
        mention.startPosition,
        mention.endPosition,
      );
      const newMentionText = newValue.slice(
        mention.startPosition,
        mention.endPosition,
      );
      return mentionText !== newMentionText;
    });
  };

  // Helper function to recalculate mention positions after text changes
  const recalculateMentionPositions = (
    remainingMentions: Mention[],
    oldValue: string,
    newValue: string,
    cursorPosition: number,
  ): Mention[] => {
    const lengthDifference = newValue.length - oldValue.length;

    return remainingMentions.map((mention) => {
      // If the mention is after the cursor position, adjust its position
      if (mention.startPosition >= cursorPosition) {
        return {
          ...mention,
          startPosition: mention.startPosition + lengthDifference,
          endPosition: mention.endPosition + lengthDifference,
        };
      }
      return mention;
    });
  };

  const insertMention = (suggestion: string): void => {
    if (!mentionState || !inputRef.current) return;

    const beforeMention = value.slice(0, mentionState.startPosition);
    const afterMention = value.slice(mentionState.endPosition);
    const mentionText = `@${suggestion}`;
    const newValue = `${beforeMention}${mentionText}${afterMention}`;
    const newCursorPosition = mentionState.startPosition + mentionText.length;

    // Create new mention object
    const newMention: Mention = {
      id: Math.random().toString(36).substr(2, 9),
      display: suggestion,
      startPosition: mentionState.startPosition,
      endPosition: mentionState.startPosition + mentionText.length,
    };

    // Update mentions array
    const updatedMentions = [...mentions, newMention];

    // Update parent component states
    onChange(newValue);
    onMentionsChange(updatedMentions);
    onMention(newMention);

    // Reset local state
    setShowSuggestions(false);
    setMentionState(null);

    // Set focus and cursor position
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition,
        );
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!showSuggestions) {
      // Handle backspace to remove mentions
      if (e.key === "Backspace" && inputRef.current) {
        const cursorPosition = inputRef.current.selectionStart || 0;
        const mention = mentions.find(
          (m) =>
            cursorPosition === m.endPosition ||
            cursorPosition === m.startPosition + 1,
        );

        if (mention) {
          e.preventDefault();
          const newValue =
            value.slice(0, mention.startPosition) +
            value.slice(mention.endPosition);
          const updatedMentions = mentions.filter((m) => m.id !== mention.id);

          onChange(newValue);
          onMentionsChange(updatedMentions);

          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(
                mention.startPosition,
                mention.startPosition,
              );
            }
          });
        }
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      setMentionState(null);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        style={{ maxHeight }}
        rows={3}
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md border bg-white shadow-lg">
          <ul className="py-1">
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                onClick={() => insertMention(suggestion)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default MentionsInput;
