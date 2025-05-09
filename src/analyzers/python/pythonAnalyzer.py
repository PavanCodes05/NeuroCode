import ast

def parse_import(node):
    imported = [alias.name for alias in node.names]
    
    return {
        "source": node.module if isinstance(node, ast.ImportFrom) else "",
        "imported": imported
    }

def parse_variable(node, line_offset=0):
    if not isinstance(node.targets[0], ast.Name):
        return None
    return {
        "name": node.targets[0].id,
        "type": None,
        "initialValue": ast.unparse(node.value) if hasattr(ast, "unparse") else None,
        "location": get_location(node, line_offset),
        "kind": "let"
    }

def parse_function(node, line_offset=0):
    return {
        "name": node.name,
        "params": [
            {
                "name": arg.arg,
                "optional": False,
                "type": None
            } for arg in node.args.args
        ],
        "returnType": None,
        "location": get_location(node, line_offset)
    }

def parse_class(node, line_offset=0):
    methods = []
    properties = []

    for item in node.body:
        if isinstance(item, ast.FunctionDef):
            methods.append(parse_function(item, line_offset))
        elif isinstance(item, ast.Assign):
            var = parse_variable(item, line_offset)
            if var:
                properties.append(var)
    
    return {
        "name": node.name,
        "methods": methods,
        "properties": properties,
        "location": get_location(node, line_offset)
    }

def get_location(node, line_offset=0):
    return {
        "start": {
            "line": node.lineno + line_offset,
            "column": node.col_offset
        },
        "end": {
            "line": getattr(node, "end_lineno", node.lineno) + line_offset,
            "column": getattr(node, "end_col_offset", node.col_offset)
        }
    }

def extract_info(tree, line_offset=0):
    imports = []
    functions = []
    classes = []
    variables = []

    for node in tree.body:
        if isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
            imports.append(parse_import(node))  # location not used
        elif isinstance(node, ast.FunctionDef):
            functions.append(parse_function(node, line_offset))
        elif isinstance(node, ast.ClassDef):
            classes.append(parse_class(node, line_offset))
        elif isinstance(node, ast.Assign):
            var = parse_variable(node, line_offset)
            if var:
                variables.append(var)
    
    return {
        "imports": imports,
        "functions": functions,
        "classes": classes,
        "variables": variables
    }
