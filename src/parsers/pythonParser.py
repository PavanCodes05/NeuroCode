import sys
import ast
import json

def parser(code):
    tree = ast.parse(code)
    ast_dict = ast.dump(tree, indent=4)

    return ast_dict

if __name__ == "__main__":
    code = sys.stdin.read()

    try:
        ast_dict = parser(code)
        print(json.dumps({"ast": ast_dict}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)