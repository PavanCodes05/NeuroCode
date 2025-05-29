// Common
import { identifyLanguage } from './common/fileLanguageUtils';
import { applyChangesToEditor } from './common/applyCodeChanges';
import { getDiffLines, clearAllDecorations, applyLineDecorations } from './common/uxHelpers';

// Python
import { handlePythonParsing } from './python/handlePythonParsing';

export { identifyLanguage, applyChangesToEditor, handlePythonParsing, getDiffLines, clearAllDecorations, applyLineDecorations };