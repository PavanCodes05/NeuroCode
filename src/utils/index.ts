// Common
import { identifyLanguage } from './common/fileLanguageUtils';
import { applyChangesToEditor } from './common/applyCodeChanges';

// Python
import { handlePythonParsing } from './python/handlePythonParsing';

export { identifyLanguage, applyChangesToEditor, handlePythonParsing };