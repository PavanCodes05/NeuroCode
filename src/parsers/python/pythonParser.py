import sys
import os

import ast
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from analyzers.python import pythonAnalyzer

def parse(code):
    tree = ast.parse(code)
    structured_code = pythonAnalyzer.extract_info(tree)

    return structured_code

if __name__ == "__main__":
    code = sys.stdin.read()

    try:
        structured_code = parse(code)
        print(json.dumps(structured_code))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)