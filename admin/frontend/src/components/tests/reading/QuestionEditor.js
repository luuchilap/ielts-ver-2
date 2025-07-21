import React from 'react';
import MultipleChoiceSingle from './questionTypes/MultipleChoiceSingle';
import MultipleChoiceMultiple from './questionTypes/MultipleChoiceMultiple';
import TrueFalseNotGiven from './questionTypes/TrueFalseNotGiven';
import FillInBlanks from './questionTypes/FillInBlanks';
import MatchingHeadings from './questionTypes/MatchingHeadings';
import MatchingInformation from './questionTypes/MatchingInformation';
import SummaryCompletion from './questionTypes/SummaryCompletion';
import SentenceCompletion from './questionTypes/SentenceCompletion';
import ShortAnswer from './questionTypes/ShortAnswer';
import NoteCompletion from './questionTypes/NoteCompletion';
import FormCompletion from './questionTypes/FormCompletion';

const QuestionEditor = ({ question, onChange }) => {
  const handleContentChange = (updates) => {
    onChange({
      ...question,
      content: {
        ...question.content,
        ...updates
      }
    });
  };

  const renderQuestionEditor = () => {
    switch (question.type) {
      case 'multiple-choice-single':
        return (
          <MultipleChoiceSingle
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'multiple-choice-multiple':
        return (
          <MultipleChoiceMultiple
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'true-false-not-given':
        return (
          <TrueFalseNotGiven
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'fill-in-blanks':
        return (
          <FillInBlanks
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'matching-headings':
        return (
          <MatchingHeadings
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'matching-information':
        return (
          <MatchingInformation
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'summary-completion':
        return (
          <SummaryCompletion
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'sentence-completion':
        return (
          <SentenceCompletion
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'short-answer':
        return (
          <ShortAnswer
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'note-completion':
        return (
          <NoteCompletion
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      case 'form-completion':
        return (
          <FormCompletion
            content={question.content}
            onChange={handleContentChange}
          />
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Unknown question type: {question.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderQuestionEditor()}
    </div>
  );
};

export default QuestionEditor; 