import type { Level, SubjectId } from "./subjects";

export interface Question {
  id: string;
  concept: string;
  text: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
}

type Raw = [concept: string, text: string, options: string[], answer: number, explanation: string, code?: string];

const BANK: Record<SubjectId, Record<Level, Raw[]>> = {
  python: {
    easy: [
      ["variables", "Which line correctly creates a variable in Python?", ["int x = 5", "x = 5", "var x := 5", "let x = 5"], 1, "Python needs no type keyword: just name = value."],
      ["data types", "What is the type of 3.14 in Python?", ["int", "str", "float", "double"], 2, "Numbers with a decimal point are float in Python."],
      ["conditions", "Which keyword starts an alternative branch after if?", ["elseif", "elif", "else if", "otherwise"], 1, "Python uses elif for 'else if'."],
      ["loops", "What does range(3) produce?", ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"], 1, "range(n) starts at 0 and stops before n."],
      ["lists", "How do you get the first item of list a?", ["a[1]", "a.first()", "a[0]", "a(0)"], 2, "Python lists are zero-indexed."],
      ["functions", "Which keyword defines a function?", ["function", "func", "def", "fn"], 2, "Functions are defined with def name():"],
      ["dictionaries", "Which creates an empty dictionary?", ["[]", "{}", "()", "dict[]"], 1, "{} is an empty dict ({} is not a set)."],
      ["oop", "Which method runs automatically when an object is created?", ["__start__", "__init__", "create()", "main()"], 1, "__init__ is the constructor in Python."],
    ],
    moderate: [
      ["loops", "What is printed?", ["0 1 2", "1 2 3", "0 2 4", "2 4 6"], 2, "range(0, 6, 2) steps by 2: 0, 2, 4.", "for i in range(0, 6, 2):\n    print(i, end=' ')"],
      ["lists", "What is the output?", ["[1, 2]", "[2, 3]", "[1, 2, 3]", "[3]"], 1, "Slicing a[1:3] takes index 1 and 2.", "a = [1, 2, 3, 4]\nprint(a[1:3])"],
      ["functions", "What does f(3) return?", ["3", "6", "9", "None"], 3, "There's no return statement, so the function returns None.", "def f(x):\n    y = x * 3\n"],
      ["conditions", "What is printed when x = 15?", ["A", "B", "C", "A B"], 1, "15 > 20 is False, 15 > 10 is True → B; elif stops further checks.", "if x > 20:\n    print('A')\nelif x > 10:\n    print('B')\nelse:\n    print('C')"],
      ["dictionaries", "What does d.get('z', 0) return?", ["KeyError", "None", "0", "'z'"], 2, "get returns the default when the key is missing.", "d = {'a': 1}"],
      ["data types", "What is 7 // 2 in Python 3?", ["3.5", "3", "4", "3.0"], 1, "// is floor division and returns an int for ints."],
      ["variables", "What is printed?", ["5 5", "10 5", "10 10", "5 10"], 1, "b received a's old value (5); reassigning a doesn't change b.", "a = 5\nb = a\na = 10\nprint(a, b)"],
      ["oop", "What does self refer to inside a method?", ["The class", "The current object", "The parent class", "The module"], 1, "self is the instance the method was called on."],
    ],
    hard: [
      ["lists", "What is printed?", ["[1]  [2]", "[1]  [1, 2]", "[1, 2]  [1, 2]", "Error"], 1, "Default mutable arguments are created once and shared between calls.", "def add(x, lst=[]):\n    lst.append(x)\n    return lst\nprint(add(1), end='  ')\nprint(add(2))"],
      ["loops", "Which bug does this loop have?", ["Infinite loop", "Off-by-one, misses last item", "Syntax error", "No bug"], 0, "i is never incremented, so i < 3 stays True forever.", "i = 0\nwhile i < 3:\n    print(i)"],
      ["dictionaries", "What is the output?", ["{'a': 1, 'b': 2}", "{'a': 3, 'b': 2}", "{'a': 1, 'b': 2, 'a': 3}", "Error"], 1, "Keys are unique; assigning d['a'] again overwrites.", "d = {'a': 1, 'b': 2}\nd['a'] = 3\nprint(d)"],
      ["functions", "What does this return for n = 4?", ["4", "10", "24", "Recursion error"], 2, "fact(4) = 4*3*2*1 = 24.", "def fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)"],
      ["oop", "What is printed?", ["Animal", "Dog", "Error", "None"], 1, "Dog overrides speak, so the subclass version runs.", "class Animal:\n    def speak(self): return 'Animal'\nclass Dog(Animal):\n    def speak(self): return 'Dog'\nprint(Dog().speak())"],
      ["data types", "What is the result of '3' + 4?", ["7", "'34'", "TypeError", "'7'"], 2, "Python won't add str and int implicitly."],
      ["conditions", "What is printed for x = 0?", ["empty", "value", "Error", "None"], 0, "0 is falsy, so `not x` is True.", "print('empty' if not x else 'value')"],
      ["variables", "What is printed?", ["[1, 2, 3]", "[1, 2, 3, 4]", "[4]", "Error"], 1, "b and a reference the same list object.", "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)"],
    ],
  },
  java: {
    easy: [
      ["variables", "Which declares an integer variable?", ["int x = 5;", "x = 5", "integer x = 5;", "num x = 5;"], 0, "Java needs a type: int x = 5;"],
      ["data types", "Which type stores true or false?", ["bool", "boolean", "Bit", "logic"], 1, "Java's type is boolean."],
      ["conditions", "Which operator checks equality of two ints?", ["=", "==", "===", "equals"], 1, "== compares primitives; = assigns."],
      ["loops", "How many times does for(int i=0;i<4;i++) run?", ["3", "4", "5", "Infinite"], 1, "i takes 0, 1, 2, 3 → 4 times."],
      ["arrays", "What is the index of the first element of an array?", ["1", "0", "-1", "Depends"], 1, "Java arrays are zero-indexed."],
      ["methods", "Which keyword means a method returns nothing?", ["null", "empty", "void", "none"], 2, "void means no return value."],
      ["classes", "Which keyword creates a new object?", ["create", "new", "make", "object"], 1, "Objects are made with new ClassName()."],
      ["inheritance", "Which keyword makes a class inherit another?", ["inherits", "implements", "extends", "super"], 2, "class B extends A."],
    ],
    moderate: [
      ["loops", "What is printed?", ["0 1 2", "1 2 3", "3 2 1", "2 1 0"], 3, "i starts at 2 and decrements until it is below 0.", "for (int i = 2; i >= 0; i--)\n  System.out.print(i + \" \");"],
      ["data types", "What is 7 / 2 when both are int?", ["3.5", "3", "4", "3.0"], 1, "Integer division truncates."],
      ["arrays", "What is nums.length?", ["2", "3", "4", "Error"], 1, "length is the number of elements.", "int[] nums = {4, 8, 12};"],
      ["methods", "What does sum(2,3) return?", ["5", "23", "6", "Error"], 0, "It returns a + b = 5.", "static int sum(int a, int b) { return a + b; }"],
      ["conditions", "What is printed for x = 5?", ["small", "medium", "large", "nothing"], 1, "5 is not < 3, but is < 10.", "if (x < 3) System.out.print(\"small\");\nelse if (x < 10) System.out.print(\"medium\");\nelse System.out.print(\"large\");"],
      ["classes", "What is printed?", ["null", "Asha", "Error", "\"\""], 1, "The constructor sets name.", "class S { String name; S(String n){ name = n; } }\nSystem.out.print(new S(\"Asha\").name);"],
      ["variables", "What is printed?", ["5", "6", "11", "56"], 1, "x++ increments x to 6 before printing.", "int x = 5;\nx++;\nSystem.out.print(x);"],
      ["inheritance", "What does super() call?", ["The child constructor", "The parent constructor", "A static method", "main()"], 1, "super() invokes the parent class constructor."],
    ],
    hard: [
      ["data types", "What is printed?", ["true", "false", "Error", "Depends"], 1, "== on Strings created with new compares references, not content.", "String a = new String(\"hi\");\nString b = new String(\"hi\");\nSystem.out.print(a == b);"],
      ["arrays", "What happens?", ["Prints 0", "Prints 3", "ArrayIndexOutOfBoundsException", "Compile error"], 2, "Valid indexes are 0..2; index 3 throws.", "int[] a = new int[3];\nSystem.out.print(a[3]);"],
      ["loops", "What is printed?", ["10", "15", "0", "Infinite loop"], 0, "Sum of 0+1+2+3+4 = 10.", "int s = 0;\nfor (int i = 0; i < 5; i++) s += i;\nSystem.out.print(s);"],
      ["inheritance", "What is printed?", ["A", "B", "AB", "Error"], 1, "Dynamic dispatch calls the overriding method in B.", "class A { String n(){return \"A\";} }\nclass B extends A { String n(){return \"B\";} }\nA o = new B();\nSystem.out.print(o.n());"],
      ["methods", "What is printed?", ["5", "10", "Error", "0"], 0, "Java passes primitives by value; x in main is unchanged.", "static void dbl(int x){ x = x * 2; }\nint x = 5; dbl(x);\nSystem.out.print(x);"],
      ["classes", "A static field is…", ["Unique per object", "Shared by all objects of the class", "Immutable", "Private by default"], 1, "static members belong to the class itself."],
      ["conditions", "What is printed?", ["yes", "no", "Error", "nothing"], 0, "&& short-circuits so the division is never evaluated.", "int a = 0;\nif (a == 0 || 10 / a > 1) System.out.print(\"yes\");\nelse System.out.print(\"no\");"],
      ["variables", "Which correctly fixes 'final int x = 1; x = 2;'?", ["Remove final", "Use static", "Use var", "Cast x"], 0, "final variables can't be reassigned."],
    ],
  },
  r: {
    easy: [
      ["variables", "Which is the conventional assignment operator in R?", ["=", "<-", ":=", "=>"], 1, "<- is the idiomatic assignment operator."],
      ["vectors", "Which function creates a vector?", ["vec()", "c()", "list()", "array()"], 1, "c() combines values into a vector."],
      ["vectors", "In R, what index is the first element?", ["0", "1", "-1", "Any"], 1, "R indexing starts at 1."],
      ["data frames", "Which function creates a data frame?", ["table()", "data.frame()", "frame()", "df()"], 1, "data.frame() builds a table."],
      ["conditions", "Which is valid R syntax?", ["if x > 5:", "if (x > 5) { }", "if x > 5 then", "when (x > 5)"], 1, "R uses if (condition) { … }."],
      ["loops", "What does 1:3 create?", ["1 3", "1 2 3", "0 1 2 3", "3"], 1, ": creates an integer sequence."],
      ["functions", "Which keyword defines a function?", ["def", "function", "fun", "fn"], 1, "name <- function(args) { … }"],
      ["data visualization", "Which base function draws a scatter plot?", ["plot()", "draw()", "chart()", "scatter()"], 0, "plot(x, y) draws a scatter plot."],
    ],
    moderate: [
      ["vectors", "What is the output?", ["2 4 6", "1 2 3 2", "Error", "3 4 5"], 0, "Arithmetic in R is vectorised.", "x <- c(1, 2, 3)\nx * 2"],
      ["vectors", "What does length(c(5, 6, 7, 8)) return?", ["3", "4", "8", "26"], 1, "There are four elements."],
      ["data frames", "How do you select the score column of df?", ["df.score", "df$score", "df->score", "df[score]"], 1, "$ extracts a column by name."],
      ["functions", "What does sq(3) return?", ["6", "9", "3", "NULL"], 1, "The last evaluated expression is returned: 3^2 = 9.", "sq <- function(n) { n^2 }"],
      ["conditions", "What does ifelse(c(1,6) > 5, 'hi', 'lo') return?", ["'hi' 'lo'", "'lo' 'hi'", "'lo'", "Error"], 1, "ifelse is vectorised: 1>5 F → lo, 6>5 T → hi."],
      ["loops", "What does this print?", ["1 2 3", "2 4 6", "6", "3"], 2, "total accumulates 1+2+3 = 6, then is printed once.", "total <- 0\nfor (i in 1:3) total <- total + i\nprint(total)"],
      ["data visualization", "Which ggplot2 layer draws bars from values?", ["geom_point()", "geom_col()", "geom_line()", "geom_text()"], 1, "geom_col uses y values as bar heights."],
      ["variables", "What does class(\"5\") return?", ["numeric", "character", "integer", "factor"], 1, "Quoted values are character strings."],
    ],
    hard: [
      ["vectors", "What does c(1, 'a', TRUE) become?", ["Mixed list", "All character", "All numeric", "Error"], 1, "Vectors coerce to the most flexible type: character."],
      ["vectors", "What is the result?", ["1 2 3 4", "2 4 4 6", "2 4 3 5", "Error"], 1, "The shorter vector is recycled: c(1,2,1,2) + c(1,2,3,4).", "c(1, 2) + c(1, 2, 3, 4)"],
      ["data frames", "Which returns rows where score > 80?", ["df[score > 80]", "df[df$score > 80, ]", "df$score > 80", "filter(score > 80)"], 1, "Row condition goes before the comma; columns after."],
      ["functions", "What is printed?", ["10", "5", "Error", "NULL"], 1, "Modifying x inside f changes only the local copy.", "x <- 5\nf <- function() { x <- 10 }\nf()\nprint(x)"],
      ["conditions", "What happens with if (c(TRUE, FALSE)) in R ≥ 4.2?", ["Uses first value", "Error: condition length > 1", "Runs twice", "Returns NA"], 1, "Since R 4.2 a length > 1 condition is an error."],
      ["loops", "Most idiomatic way to square each element of x?", ["for loop", "x^2", "while loop", "repeat"], 1, "Vectorised operations are faster and clearer."],
      ["data visualization", "What's missing to see points?", ["Nothing", "+ geom_point()", "print()", "plot = TRUE"], 1, "ggplot() only sets up the canvas; a geom draws the data.", "ggplot(df, aes(x, y))"],
      ["variables", "What does is.na(NA + 1) return?", ["FALSE", "TRUE", "1", "Error"], 1, "Any arithmetic with NA gives NA."],
    ],
  },
  javascript: {
    easy: [
      ["variables", "Which declares a value that cannot be reassigned?", ["var", "let", "const", "fixed"], 2, "const prevents reassignment."],
      ["data types", "What does typeof 'hi' return?", ["'text'", "'string'", "'char'", "'object'"], 1, "Strings have type 'string'."],
      ["functions", "Which is an arrow function?", ["function => x", "(x) => x * 2", "x -> x * 2", "fn(x) x*2"], 1, "Arrow syntax: (params) => expression."],
      ["arrays", "Which method adds an item to the end of an array?", ["add()", "push()", "append()", "insert()"], 1, "push adds to the end."],
      ["objects", "How do you read the name property of obj?", ["obj->name", "obj.name", "obj::name", "obj(name)"], 1, "Dot notation reads properties."],
      ["dom", "Which selects the first element matching a CSS selector?", ["document.find()", "document.querySelector()", "document.get()", "window.select()"], 1, "querySelector returns the first match."],
      ["events", "Which method listens for a click?", ["onClick()", "addEventListener('click', fn)", "listen('click')", "click.on()"], 1, "addEventListener attaches handlers."],
      ["data types", "Which is NOT a primitive type?", ["number", "boolean", "object", "string"], 2, "Objects are reference types."],
    ],
    moderate: [
      ["data types", "What is 1 + '2'?", ["3", "'12'", "NaN", "Error"], 1, "+ with a string concatenates."],
      ["arrays", "What is printed?", ["[1, 2, 3]", "[2, 4, 6]", "6", "undefined"], 1, "map returns a new array of transformed values.", "console.log([1, 2, 3].map(n => n * 2));"],
      ["functions", "What does add(2) return?", ["2", "NaN", "Error", "undefined"], 1, "b is undefined, and 2 + undefined is NaN.", "const add = (a, b) => a + b;"],
      ["objects", "What is printed?", ["1", "2", "undefined", "Error"], 1, "Objects are references; o2 modifies the same object.", "const o = { a: 1 };\nconst o2 = o;\no2.a = 2;\nconsole.log(o.a);"],
      ["variables", "What is printed?", ["1", "2", "Error", "undefined"], 0, "let is block-scoped; the inner x is separate.", "let x = 1;\n{ let x = 2; }\nconsole.log(x);"],
      ["dom", "Which property safely sets plain text of an element?", ["innerHTML", "textContent", "value", "html"], 1, "textContent doesn't parse HTML."],
      ["events", "What does event.preventDefault() do on a form submit?", ["Stops the page reload", "Deletes the form", "Stops JavaScript", "Submits twice"], 0, "It cancels the browser's default action."],
      ["arrays", "What does [3, 1, 2].includes(2) return?", ["2", "true", "1", "false"], 1, "includes returns a boolean."],
    ],
    hard: [
      ["data types", "What is 0.1 + 0.2 === 0.3?", ["true", "false", "Error", "undefined"], 1, "Floating point rounding gives 0.30000000000000004."],
      ["variables", "What is printed?", ["0 1 2", "3 3 3", "undefined ×3", "Error"], 1, "var is function-scoped; all callbacks see i = 3.", "for (var i = 0; i < 3; i++)\n  setTimeout(() => console.log(i));"],
      ["functions", "What is printed?", ["1", "2", "3", "Error"], 1, "The closure keeps count between calls.", "function counter(){ let c = 0; return () => ++c; }\nconst f = counter(); f();\nconsole.log(f());"],
      ["arrays", "What does [10, 1, 2].sort() return?", ["[1, 2, 10]", "[1, 10, 2]", "[10, 2, 1]", "[2, 1, 10]"], 1, "Default sort compares strings: '1' < '10' < '2'."],
      ["objects", "What is printed?", ["2", "1", "undefined", "Error"], 1, "Spread makes a shallow copy; changing copy.a doesn't affect o.", "const o = { a: 1 };\nconst copy = { ...o };\ncopy.a = 2;\nconsole.log(o.a);"],
      ["events", "Why use event delegation?", ["To block events", "Handle many child events with one parent listener", "Make events sync", "Avoid DOM"], 1, "Events bubble, so one parent listener can handle children."],
      ["dom", "Why might querySelector return null in a script in <head>?", ["Typo always", "DOM hasn't loaded yet", "Browser bug", "CSS missing"], 1, "Run after DOMContentLoaded or use defer."],
      ["data types", "What is [] == false?", ["true", "false", "Error", "undefined"], 0, "Loose equality coerces [] → '' → 0 and false → 0."],
    ],
  },
  cpp: {
    easy: [
      ["syntax", "Which statement prints in C++?", ["print(x);", "std::cout << x;", "echo x;", "System.out(x);"], 1, "cout with << prints to the console."],
      ["variables", "Which declares a double?", ["double d = 2.5;", "d = 2.5;", "float: d = 2.5", "dbl d = 2.5;"], 0, "Type then name: double d."],
      ["conditions", "Which is the logical AND operator?", ["&", "&&", "and&", "+"], 1, "&& is logical AND."],
      ["loops", "Which loop runs at least once?", ["for", "while", "do-while", "foreach"], 2, "do-while checks the condition after the body."],
      ["arrays", "What is the last valid index of int a[5]?", ["5", "4", "6", "0"], 1, "Indexes go 0..4."],
      ["functions", "What must a function declare before its name?", ["Its return type", "Its file", "public", "def"], 0, "e.g. int add(int a, int b)."],
      ["pointers", "Which operator gives a variable's address?", ["*", "&", "#", "@"], 1, "&x is the address of x."],
      ["classes", "Default access for class members is…", ["public", "private", "protected", "static"], 1, "class members are private by default."],
    ],
    moderate: [
      ["loops", "What is printed?", ["1 2 3", "0 1 2", "1 2", "0 1 2 3"], 0, "i runs from 1 while i <= 3.", "for (int i = 1; i <= 3; i++) std::cout << i << ' ';"],
      ["pointers", "What is printed?", ["Address of x", "5", "10", "Error"], 2, "*p = 10 writes through the pointer into x.", "int x = 5;\nint* p = &x;\n*p = 10;\nstd::cout << x;"],
      ["functions", "What is printed?", ["5", "10", "Error", "0"], 1, "Pass-by-reference (&) changes the caller's variable.", "void dbl(int& n){ n *= 2; }\nint x = 5; dbl(x);\nstd::cout << x;"],
      ["variables", "What is 7 % 3?", ["2", "1", "2.33", "0"], 1, "% gives the remainder."],
      ["conditions", "What is printed for n = 0?", ["zero", "positive", "negative", "nothing"], 0, "The first condition n == 0 is true.", "if (n == 0) std::cout << \"zero\";\nelse if (n > 0) std::cout << \"positive\";\nelse std::cout << \"negative\";"],
      ["classes", "What is a constructor?", ["A method named after the class that initialises objects", "A destructor", "A static variable", "A loop"], 0, "Constructors share the class's name and have no return type."],
      ["oop", "Which OOP principle hides data behind methods?", ["Inheritance", "Encapsulation", "Polymorphism", "Recursion"], 1, "Encapsulation keeps fields private and exposes methods."],
      ["arrays", "What is printed?", ["6", "3", "123", "Error"], 0, "Sum of 1+2+3 = 6.", "int a[] = {1, 2, 3}; int s = 0;\nfor (int v : a) s += v;\nstd::cout << s;"],
    ],
    hard: [
      ["pointers", "What's wrong here?", ["Nothing", "Dangling pointer to a destroyed local", "Syntax error", "Memory leak only"], 1, "x dies when f returns, so the pointer dangles.", "int* f() { int x = 5; return &x; }"],
      ["oop", "What is printed?", ["Animal", "Dog", "Error", "Nothing"], 1, "virtual enables runtime polymorphism through base pointers.", "struct Animal { virtual void s(){ std::cout<<\"Animal\"; } };\nstruct Dog : Animal { void s() override { std::cout<<\"Dog\"; } };\nAnimal* a = new Dog(); a->s();"],
      ["arrays", "What happens accessing a[10] for int a[5]?", ["Exception thrown", "Undefined behaviour", "Returns 0", "Compile error"], 1, "C++ doesn't bounds-check raw arrays."],
      ["classes", "Memory from new should be released with…", ["free", "delete", "remove", "Nothing"], 1, "Pair new with delete (or use smart pointers)."],
      ["loops", "How many times does this run?", ["10", "0", "Infinite", "9"], 2, "unsigned i is never < 0; after 0 it wraps to a huge value.", "for (unsigned int i = 9; i >= 0; i--) { }"],
      ["functions", "Which is function overloading?", ["Two functions with same name, different parameters", "Recursion", "A virtual function", "A lambda"], 0, "The compiler picks based on parameter types."],
      ["variables", "What is printed?", ["2.5", "2", "3", "Error"], 1, "5/2 is integer division before assignment to double.", "double d = 5 / 2;\nstd::cout << d;"],
      ["syntax", "What's the bug?", ["Missing semicolon", "Should use =", "Assignment = in condition instead of ==", "Nothing"], 2, "x = 5 assigns, and is always true.", "if (x = 5) { /* ... */ }"],
    ],
  },
  c: {
    easy: [
      ["variables", "Which declares an integer in C?", ["int x;", "integer x;", "x: int;", "var x;"], 0, "C uses type name;."],
      ["data types", "Which format specifier prints an int?", ["%f", "%d", "%c", "%s"], 1, "%d is for int."],
      ["operators", "What does % do?", ["Percentage", "Remainder", "Division", "Power"], 1, "% gives the remainder of integer division."],
      ["conditions", "Which compares two values for equality?", ["=", "==", "=!", "eq"], 1, "== compares, = assigns."],
      ["loops", "Which loop is best when you know the count?", ["for", "goto", "switch", "if"], 0, "for is ideal for counted loops."],
      ["arrays", "How do you declare an array of 5 ints?", ["int a(5);", "int a[5];", "array int a = 5;", "int[5] a;"], 1, "type name[size];"],
      ["functions", "Which function is the program's entry point?", ["start()", "main()", "init()", "run()"], 1, "Execution begins at main()."],
      ["pointers", "Which declares a pointer to int?", ["int p*;", "int *p;", "ptr int p;", "int &p;"], 1, "int *p declares an int pointer."],
    ],
    moderate: [
      ["operators", "What is printed?", ["3.5", "3", "4", "1"], 1, "int / int truncates.", "printf(\"%d\", 7 / 2);"],
      ["loops", "What is printed?", ["0 1 2", "1 2 3", "0 1 2 3", "1 2"], 0, "i goes 0, 1, 2.", "for (int i = 0; i < 3; i++) printf(\"%d \", i);"],
      ["pointers", "What is printed?", ["5", "10", "An address", "Error"], 1, "Writing via *p changes x.", "int x = 5; int *p = &x;\n*p = 10;\nprintf(\"%d\", x);"],
      ["arrays", "What is printed?", ["1", "2", "3", "Garbage"], 2, "a[2] is the third element.", "int a[] = {1, 2, 3};\nprintf(\"%d\", a[2]);"],
      ["functions", "What is printed?", ["5", "10", "0", "Error"], 0, "C passes by value; swap of copy doesn't affect x.", "void dbl(int n){ n = n * 2; }\nint x = 5; dbl(x);\nprintf(\"%d\", x);"],
      ["conditions", "What is printed when x = 7?", ["odd", "even", "both", "none"], 0, "7 % 2 is 1, not 0.", "if (x % 2 == 0) printf(\"even\");\nelse printf(\"odd\");"],
      ["data types", "What does sizeof(char) always equal?", ["1", "2", "4", "Depends"], 0, "sizeof(char) is 1 by definition."],
      ["variables", "What is printed?", ["5", "6", "4", "Error"], 1, "x++ then prints the incremented value.", "int x = 5; x++;\nprintf(\"%d\", x);"],
    ],
    hard: [
      ["pointers", "What does *(a + 1) give for int a[] = {4, 8, 12}?", ["4", "8", "Address", "5"], 1, "a + 1 points to a[1]; * dereferences it."],
      ["arrays", "Why is this dangerous?", ["It's not", "Writes past the end (index 5)", "Syntax error", "Arrays can't loop"], 1, "i <= 5 accesses a[5], out of bounds.", "int a[5];\nfor (int i = 0; i <= 5; i++) a[i] = 0;"],
      ["functions", "How do you let a function modify the caller's int?", ["Return void", "Pass a pointer", "Use global only", "Impossible"], 1, "Pass &x and write through *p."],
      ["operators", "What is printed?", ["6 6", "5 6", "6 5", "5 5"], 1, "x++ returns the old value then increments.", "int x = 5;\nint y = x++;\nprintf(\"%d %d\", y, x);"],
      ["conditions", "What's the bug?", ["Missing braces", "= instead of ==, always true", "Wrong printf", "No bug"], 1, "x = 0 assigns 0 → condition false; meant ==.", "if (x = 0) printf(\"zero\");"],
      ["loops", "What is printed?", ["0 1 2 3 4", "0 1 2", "0 1 2 4", "1 3"], 2, "continue skips printing 3.", "for (int i = 0; i < 5; i++) {\n  if (i == 3) continue;\n  printf(\"%d \", i);\n}"],
      ["pointers", "What's wrong with int *p; *p = 5;?", ["Nothing", "p is uninitialised (wild pointer)", "Missing &", "Should be **p"], 1, "p points nowhere valid; writing is undefined behaviour."],
      ["data types", "What is printed?", ["2.500000", "2.000000", "2", "Error"], 1, "5/2 is computed as int (2) before converting to float.", "float f = 5 / 2;\nprintf(\"%f\", f);"],
    ],
  },
};

function shuffle<T>(arr: T[], rnd = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function allQuestions(subject: SubjectId, level: Level): Question[] {
  return BANK[subject][level].map(([concept, text, options, answer, explanation, code], i) => ({
    id: `${subject}-${level}-${i}`,
    concept, text, options, answer, explanation, code,
  }));
}

/**
 * Build a 5-question quiz. Prioritise focus concepts (selected topic or weak concepts),
 * avoid recently seen question ids where possible, then fill up.
 */
export function buildQuiz(subject: SubjectId, level: Level, focus: string[] = [], avoidIds: string[] = []): Question[] {
  const pool = shuffle(allQuestions(subject, level));
  const fresh = pool.filter((q) => !avoidIds.includes(q.id));
  const stale = pool.filter((q) => avoidIds.includes(q.id));
  const ordered = [...fresh, ...stale];
  const focused = ordered.filter((q) => focus.includes(q.concept));
  const rest = ordered.filter((q) => !focus.includes(q.concept));
  return [...focused.slice(0, 3), ...rest, ...focused.slice(3)].slice(0, 5);
}
