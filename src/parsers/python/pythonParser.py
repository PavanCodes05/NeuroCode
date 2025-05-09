import sys
import os

import ast
import argparse
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from analyzers.python import pythonAnalyzer

def parse(code, line_offset):
    tree = ast.parse(code)
    structured_code = pythonAnalyzer.extract_info(tree, line_offset)

    return structured_code

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--line_offset", type=int, default=0)
    args = parser.parse_args()

    code = sys.stdin.read()

    try:
        structured_code = parse(code, args.line_offset)
        print(json.dumps(structured_code))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)