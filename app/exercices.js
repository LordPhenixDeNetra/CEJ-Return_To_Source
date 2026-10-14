/*
 * Contenu du cahier. Mini-syntaxe dans les chaînes :
 *   `code`  → code en ligne      **gras** → gras
 *   "- ..." → élément de liste   "### ..." → sous-titre
 * Les noms de fonctions sont donnés en camelCase (style Java) :
 * adapte-les aux conventions de ton langage (snake_case en Python, C, Rust).
 */

const LANGAGES = {
  java:   { nom: "Java",   couleur: "#e76f00" },
  python: { nom: "Python", couleur: "#3776ab" },
  c:      { nom: "C",      couleur: "#5c6bc0" },
  cpp:    { nom: "C++",    couleur: "#00599c" },
  go:     { nom: "Go",     couleur: "#00a7cf" },
  rust:   { nom: "Rust",   couleur: "#ce412b" },
};

const MISE_EN_ROUTE = {
  java: [
    "JDK 17 ou plus récent. IDE : Eclipse, IntelliJ IDEA ou VS Code.",
    "Compiler puis lancer : `javac Somme.java` puis `java Somme` (ou directement `java Somme.java`).",
    "Une classe publique par fichier ; le fichier porte le nom de la classe.",
  ],
  python: [
    "Python 3.10 ou plus récent : `python fichier.py`.",
    "Conventions : `snake_case` pour fonctions et variables, `PascalCase` pour les classes.",
    "Laisse un petit test avec `assert` sous `if __name__ == \"__main__\":`.",
  ],
  c: [
    "Compiler avec les avertissements : `gcc -Wall -Wextra -std=c17 prog.c -o prog`.",
    "Sous Windows : MSYS2/MinGW ou WSL. Détecter les fuites : `-fsanitize=address` ou Valgrind.",
    "Pas de classes en C : chaque « objet » devient une `struct` + des fonctions préfixées (`point_translater`).",
  ],
  cpp: [
    "Compiler : `g++ -Wall -Wextra -std=c++20 prog.cpp -o prog`.",
    "Style moderne : RAII, `std::string`, `std::vector`, pointeurs intelligents ; jamais de `new`/`delete` bruts.",
    "Sépare déclaration (`.hpp`) et définition (`.cpp`) dès que la classe grossit.",
  ],
  go: [
    "Go 1.22+ : `go mod init cahier` une fois, puis `go run .`.",
    "Pas de classes : `struct` + méthodes ; pas d'héritage : composition (embedding) + interfaces.",
    "Visibilité par la casse : `Nom` est exporté, `nom` est privé au package. Formate avec `gofmt`.",
  ],
  rust: [
    "Installer via rustup. Un projet par exercice : `cargo new exo06` puis `cargo run`.",
    "Pas de classes : `struct` + `impl` ; pas d'héritage : composition + traits ; pas d'exceptions : `Result`.",
    "Lis attentivement les erreurs du compilateur et passe `cargo clippy` : ils enseignent beaucoup.",
  ],
};

const PARTIES = [
  {
    id: "p1", titre: "Fondamentaux",
    resume: "Arguments, saisie clavier, conditions, boucles, fonctions.",
    notes: {
      java: ["Saisie clavier : `Scanner sc = new Scanner(System.in);` puis `sc.nextInt()`, `sc.nextLine()`.", "Méthodes `static` dans la classe principale tant qu'on ne crée pas d'objets."],
      python: ["`input()` renvoie toujours une `str` : convertis avec `int()`/`float()` et intercepte `ValueError`.", "Découpe en fonctions ; le programme principal va sous `if __name__ == \"__main__\":`."],
      c: ["Saisie : `scanf(\"%d\", &n)` et **vérifie sa valeur de retour** (1 si réussi). Plus robuste : `fgets` + `strtol`.", "Après un `scanf` raté, vide le tampon d'entrée sinon la boucle de saisie tourne à l'infini.", "`exit(0)` est dans `<stdlib.h>`."],
      cpp: ["Saisie : `std::cin >> n;` puis teste `if (!std::cin)` ; en cas d'échec : `std::cin.clear()` et `std::cin.ignore(...)`.", "Affichage : `std::cout << ... << '\\n';`"],
      go: ["Saisie simple : `fmt.Scan(&n)` (renvoie une erreur à tester). Ligne entière : `bufio.NewScanner(os.Stdin)`.", "Conversions : `strconv.Atoi`, `strconv.ParseFloat` renvoient `(valeur, err)`.", "Quitter : `os.Exit(0)`."],
      rust: ["Saisie : `let mut s = String::new(); io::stdin().read_line(&mut s)?;` puis `s.trim().parse::<i32>()` qui renvoie un `Result`.", "Utilise `match` sur le `Result` pour redemander en cas d'erreur.", "Quitter : `std::process::exit(0)`."],
    },
  },
  {
    id: "p2", titre: "Classes & objets",
    resume: "Encapsulation, constructeurs, méthodes, visibilité, modules.",
    notes: {
      java: ["Champs `private`, accès par méthodes publiques.", "Chaîner les constructeurs avec `this(...)` (première instruction).", "La visibilité « package » (sans mot-clé) se teste en plaçant une classe de test dans un autre package."],
      python: ["Un seul `__init__` : simule plusieurs constructeurs par des valeurs par défaut ou des `@classmethod` (ex. `Point.origine()`).", "Attributs « privés » par convention : `_x` ; `__str__` pour l'affichage.", "Un module = un fichier ; un paquet = un dossier."],
      c: ["Pas de classes : `typedef struct { ... } Point;` + fonctions `point_xxx(Point *p, ...)`.", "Les « constructeurs » sont des fonctions qui renvoient une struct initialisée (`point_creer(x, y)`).", "Sépare `point.h` (déclarations) et `point.c` (définitions). Bonus encapsulation : struct opaque déclarée seulement dans le `.h`."],
      cpp: ["`class` avec sections `private:` / `public:` ; méthodes de lecture marquées `const`.", "Constructeurs délégués : `Point() : Point(0, 0) {}`.", "Liste d'initialisation : `Point(float x, float y) : x_(x), y_(y) {}`."],
      go: ["`type Point struct { x, y float32 }` + méthodes à récepteur pointeur `func (p *Point) Translater(dx, dy float32)`.", "Constructeurs par convention : `NewPoint(...)` ; plusieurs constructeurs = plusieurs fonctions.", "Encapsulation : champs en minuscule + test dans un autre package."],
      rust: ["`struct` + bloc `impl` ; constructeurs = fonctions associées (`Point::new`, `Point::origine`).", "`&self` pour lire, `&mut self` pour modifier.", "Encapsulation : champs privés par défaut hors du module ; expose avec `pub`."],
    },
  },
  {
    id: "p3", titre: "Chaînes de caractères",
    resume: "Parcours, recherche, transformation et découpage de chaînes.",
    notes: {
      java: ["`String` est immuable ; pour construire une chaîne en boucle, utilise `StringBuilder`.", "Accès : `s.charAt(i)`, `s.length()`. Les méthodes toutes faites (`reverse`, `indexOf`, `contains`...) sont interdites quand l'exercice demande de coder l'algorithme."],
      python: ["`str` est immuable ; accumule dans une liste puis `\"\".join(...)`.", "L'intérêt est de coder l'algorithme : pas de `s[::-1]`, `s.count`, `in`, `find`, `split` quand c'est justement ce qu'on implémente."],
      c: ["Une chaîne est un `char[]` terminé par `'\\0'` : n'oublie jamais la place du terminateur.", "Pour renvoyer une nouvelle chaîne : `malloc(len + 1)`, et l'appelant fait `free`.", "Pour renvoyer un tableau, renvoie aussi sa taille (paramètre `size_t *taille`).", "N'utilise pas `strstr`, `strrev`... quand l'exercice demande de les recoder."],
      cpp: ["`std::string` et `std::vector<char>` ; accès par `s[i]` ou `s.at(i)` (vérifié).", "Pas de `std::reverse`, `std::count`, `find` quand l'exercice demande l'algorithme."],
      go: ["Une `string` est une suite d'octets UTF-8 : `\"été\"` fait 5 octets ! Convertis en `[]rune` pour travailler caractère par caractère.", "`for i, r := range s` parcourt les runes.", "Construire efficacement : `strings.Builder`."],
      rust: ["`String` (possédée) et `&str` (empruntée), toujours en UTF-8 : pas d'indexation `s[i]`.", "Parcours : `s.chars()` ; ou `let v: Vec<char> = ...` construit à la main.", "Prends `&str` en paramètre, renvoie `String`."],
    },
  },
  {
    id: "p4", titre: "Tableaux & tris",
    resume: "Parcours, inversion, tri par sélection, tableaux 2D.",
    notes: {
      java: ["Tableaux de taille fixe : `int[] t = new int[n];`, `t.length`.", "Pas de `Arrays.sort` : on écrit le tri soi-même."],
      python: ["Les listes Python jouent le rôle des tableaux.", "Interdits ici : `sort`, `sorted`, `reverse`, `reversed`, `min` avec `key`... on code l'algorithme."],
      c: ["Un tableau passé à une fonction se dégrade en pointeur : passe toujours sa taille.", "Tableau renvoyé par une fonction : `malloc`, et documente qui doit faire `free`.", "Comparer deux chaînes : `strcmp` (négatif, 0, positif)."],
      cpp: ["`std::vector<int>` ; passe par référence (`std::vector<int>&`) pour modifier, `const&` pour lire.", "Pas de `std::sort` ni de `std::swap` : écris `echanger` toi-même."],
      go: ["Slices `[]int` : passées « par référence » vers le même tableau sous-jacent.", "Pas de `sort.Slice` ni de `slices.Sort` : algorithme à la main."],
      rust: ["`Vec<T>` et tranches `&[T]` / `&mut [T]`.", "Pas de `.sort()`, `.reverse()` ni `.swap()` : écris-les toi-même (l'emprunteur va te faire réfléchir à `echanger`)."],
    },
  },
  {
    id: "p5", titre: "Objets composés & grands nombres",
    resume: "Objets membres, collections d'objets, mini-applications, grands entiers.",
    notes: {
      java: ["Un objet peut contenir d'autres objets (composition).", "Grands entiers : `java.math.BigInteger` (`multiply`, `valueOf`, `ONE`)."],
      python: ["Composition naturelle : un attribut peut être n'importe quel objet.", "Les `int` Python sont déjà de taille illimitée."],
      c: ["Une struct peut contenir une autre struct (par valeur) ou un pointeur vers elle.", "Collections d'objets : tableau de structs alloué avec `malloc` + compteur + capacité.", "Pas de grands entiers : à implémenter (tableau de chiffres)."],
      cpp: ["Composition : membre objet initialisé dans la liste d'initialisation.", "Collections : `std::vector<T>` ; renvoyer « peut-être rien » : `std::optional<T>`."],
      go: ["Composition : champ de type struct.", "Grands entiers : `math/big` (`new(big.Int)`, `Mul`, `SetInt64`)."],
      rust: ["Composition : champ de type struct ; « peut-être rien » : `Option<T>`.", "La bibliothèque standard n'a pas de grands entiers : crate `num-bigint` ou implémentation maison (recommandé)."],
    },
  },
  {
    id: "p6", titre: "Héritage & polymorphisme",
    resume: "Hiérarchies de types, redéfinition, interfaces, égalité.",
    notes: {
      java: ["`extends`, `super(...)`, `@Override`, interfaces avec `implements`.", "Polymorphisme : une variable de type parent peut désigner un objet enfant."],
      python: ["Héritage : `class Sportif(Etudiant):` et `super().__init__(...)`.", "Interfaces : classes abstraites (`abc.ABC`, `@abstractmethod`) ou simplement le « duck typing »."],
      c: ["Pas d'héritage : mets la struct « parente » comme **premier champ** de la struct « enfant ».", "Polymorphisme manuel : un pointeur de fonction dans la struct de base (une mini table virtuelle).", "Alternative idiomatique : union étiquetée (`enum` de type + `union`)."],
      cpp: ["Héritage `public`, méthodes `virtual` + `override`, **destructeur virtuel** dans la classe de base.", "Collection polymorphe : `std::vector<std::unique_ptr<Base>>`.", "Interface : classe avec méthodes virtuelles pures (`= 0`)."],
      go: ["Pas d'héritage : **embedding** (`type Sportif struct { Etudiant; Sport string }`) qui promeut les champs et méthodes.", "Le polymorphisme passe par les **interfaces**, satisfaites implicitement.", "Attention : l'embedding n'est pas de l'héritage, la « base » ne voit jamais les méthodes de l'« enfant »."],
      rust: ["Pas d'héritage : composition (champ `base: Etudiant`) + **traits**.", "Collection polymorphe : `Vec<Box<dyn Affichable>>` ; ou un `enum` quand la liste des variantes est fermée.", "Un trait peut fournir des méthodes par défaut."],
    },
  },
  {
    id: "p7", titre: "Listes dynamiques & généricité",
    resume: "Listes extensibles, valeurs hétérogènes, fonctions génériques.",
    notes: {
      java: ["`ArrayList<T>` (`add`, `get`, `set`, `size`) avec des génériques plutôt que des types bruts.", "Généricité : `<T extends Comparable<T>>`."],
      python: ["`list` est déjà dynamique et hétérogène.", "Bonus : annotations génériques (`list[str]`, `TypeVar`) vérifiées avec mypy."],
      c: ["Pas de liste dynamique : implémente un vecteur `{ data, taille, capacite }` qui double sa capacité avec `realloc`.", "Généricité en C : `void *` + taille d'élément + pointeur de fonction de comparaison (comme `qsort`)."],
      cpp: ["`std::vector<T>` ; généricité avec les `template` (et `concepts` en C++20).", "Valeurs hétérogènes : `std::variant` + `std::visit`."],
      go: ["Slices + `append`.", "Généricité (Go 1.18+) : `func Min[T cmp.Ordered](v []T) T`.", "Valeurs hétérogènes : `[]any` + `switch v := x.(type)`."],
      rust: ["`Vec<T>` (`push`, indexation, `len`).", "Généricité : `fn f<T: PartialOrd>(v: &[T])`.", "Valeurs hétérogènes : un `enum` avec une variante par type."],
    },
  },
  {
    id: "p8", titre: "Gestion des erreurs",
    resume: "Signaler, propager et traiter les erreurs proprement.",
    notes: {
      java: ["Exception personnalisée : `class NombreNegatifException extends Exception`.", "`throw`, `throws`, `try / catch / finally`."],
      python: ["Exception personnalisée : `class NombreNegatifError(Exception): pass`.", "`raise`, `try / except / else / finally`."],
      c: ["Pas d'exceptions : la fonction renvoie un **code d'erreur** (`int` ou `enum`) et le résultat passe par un pointeur.", "`errno` (`EDOM`, `ERANGE`) pour les erreurs mathématiques.", "Toujours tester le code de retour chez l'appelant."],
      cpp: ["Exception personnalisée dérivée de `std::runtime_error` ou `std::domain_error`.", "Attention : une division entière par zéro **ne lève pas** d'exception en C++ (comportement indéfini) : à tester toi-même."],
      go: ["Pas d'exceptions : renvoie `(resultat, error)` ; crée les erreurs avec `errors.New` / `fmt.Errorf`.", "Type d'erreur personnalisé : n'importe quel type avec une méthode `Error() string` ; teste-le avec `errors.As`.", "`panic`/`recover` sont réservés aux situations vraiment exceptionnelles."],
      rust: ["Pas d'exceptions : `Result<T, E>` avec un `enum` d'erreur personnalisé qui implémente `Display`.", "Propagation avec l'opérateur `?`.", "Arithmétique sûre : `checked_div`, `checked_mul` renvoient un `Option`."],
    },
  },
  {
    id: "p9", titre: "Concurrence",
    resume: "Threads, exclusion mutuelle, synchronisation.",
    notes: {
      java: ["`extends Thread` ou `implements Runnable` ; `start()`, `join()`.", "Exclusion mutuelle : méthodes ou blocs `synchronized`. Attente : `wait()` / `notifyAll()`."],
      python: ["`threading.Thread(target=...)`, `start()`, `join()`.", "Exclusion mutuelle : `lock = threading.Lock()` puis `with lock:`.", "Le GIL ne protège **pas** une opération `solde += x` (lecture, calcul, écriture)."],
      c: ["POSIX threads : `pthread_create`, `pthread_join`, `pthread_mutex_t`, `pthread_cond_t`.", "Compiler avec `-pthread` (sous Windows : MSYS2 ou WSL). Détecter les courses : `-fsanitize=thread`."],
      cpp: ["`std::thread`, `join()`, `std::mutex` + `std::lock_guard` / `std::scoped_lock`.", "Attente d'un événement : `std::condition_variable` ou `std::promise`/`std::future`."],
      go: ["Goroutines (`go f()`), `sync.WaitGroup` pour attendre, `sync.Mutex` pour protéger.", "Ou communique par **channels** plutôt que de partager la mémoire.", "Détecteur de courses : `go run -race .`."],
      rust: ["`std::thread::spawn` + `join()` ; partage : `Arc<Mutex<T>>`.", "Le compilateur **refuse** les courses de données : essaie sans `Mutex` et lis l'erreur.", "Communication : `std::sync::mpsc` ; attente : `Condvar`."],
    },
  },
  {
    id: "p10", titre: "Fichiers & interfaces",
    resume: "Lecture/écriture de fichiers, interfaces utilisateur, projet complet.",
    notes: {
      java: ["Interface graphique : Swing (`JFrame`, `JTextField`, `JButton`, `JTextArea`, `JOptionPane`).", "Fichiers : `java.nio.file.Files` (`writeString`, `readAllLines`) ou `BufferedReader`/`PrintWriter`.", "Empaquetage : fichiers `.jar`."],
      python: ["Interface graphique : `tkinter` (`Entry`, `Button`, `Text`, `messagebox`, `filedialog`).", "Filtrer la frappe dans un champ : `validatecommand` d'un `Entry`.", "Fichiers : `pathlib.Path` et `with open(...) as f:`."],
      c: ["Interface en mode console : un menu numéroté dans une boucle (bonus : GTK).", "Fichiers : `fopen`, `fprintf`, `fgets`, `fclose` ; teste chaque appel.", "Bibliothèque : compile la logique métier en bibliothèque statique (`ar rcs libbanque.a ...`)."],
      cpp: ["Interface en mode console avec un menu (bonus : Qt).", "Fichiers : `std::ofstream` / `std::ifstream`, dossiers : `std::filesystem`."],
      go: ["Interface en mode console, ou petite interface web avec `net/http` + `html/template`.", "Fichiers : `os.ReadFile`, `os.WriteFile`, `os.MkdirAll`, `bufio.Scanner`.", "Organisation : un module avec plusieurs packages."],
      rust: ["Interface en mode console (bonus : `egui` ou `iced`).", "Fichiers : `std::fs::read_to_string`, `std::fs::write`, `create_dir_all`, `BufReader::lines`.", "Organisation : un crate bibliothèque (`lib.rs`) + un binaire, ou un workspace."],
    },
  },
  {
    id: "p11", titre: "Collections & bases de données",
    resume: "Tables associatives, persistance SQL, interface de gestion.",
    notes: {
      java: ["Table associative : `HashMap` (ou `ConcurrentHashMap` en multi-thread ; `Hashtable` est historique).", "Base de données : JDBC (`DriverManager`, `PreparedStatement`) avec MySQL ou SQLite (`sqlite-jdbc`)."],
      python: ["Table associative : `dict`.", "Base de données : `sqlite3` (intégré) ou `mysql-connector-python`.", "Requêtes **toujours paramétrées** : `cur.execute(\"... WHERE num = ?\", (num,))`."],
      c: ["Pas de table associative : implémente une table de hachage simple (tableau de listes chaînées), ou un tableau trié + recherche dichotomique.", "Base de données : bibliothèque `sqlite3` (`sqlite3_prepare_v2`, `sqlite3_bind_*`, `sqlite3_step`)."],
      cpp: ["Table associative : `std::unordered_map` (ou `std::map` pour l'ordre).", "Base de données : API C de SQLite ou SQLiteCpp."],
      go: ["Table associative : `map[string]*Compte`, protégée par un `sync.Mutex`.", "Base de données : `database/sql` + pilote (`modernc.org/sqlite` ou `go-sql-driver/mysql`)."],
      rust: ["Table associative : `HashMap<String, Compte>`.", "Base de données : crate `rusqlite` (SQLite) ou `mysql`.", "Requêtes paramétrées avec `params![...]`."],
    },
  },
];

const EXERCICES = [
  // ───────────────────────── Fondamentaux ─────────────────────────
  {
    id: "1", partie: "p1", titre: "Somme des arguments de la ligne de commande",
    notions: ["arguments", "conversion", "point d'entrée"],
    enonce: [
      "**Question préliminaire :** à quoi sert le paramètre de la fonction principale qui reçoit les arguments de la ligne de commande ?",
      "Écrire un programme qui calcule et affiche la somme de deux entiers passés en arguments sur la ligne de commande (terminal Windows ou shell Unix).",
      "Attention : les arguments arrivent sous forme de **chaînes de caractères**. Il faut les convertir en entiers.",
      "- Si un argument manque, afficher un message d'usage.",
      "- Si un argument n'est pas un entier, afficher une erreur claire au lieu de planter.",
    ],
    sortie: "$ somme 24 18\n24 + 18 = 42\n\n$ somme 24\nUsage : somme <entier1> <entier2>",
    langs: {
      java: ["Paramètre `String[] args` de `main` ; conversion : `Integer.parseInt(args[0])`.", "Une saisie invalide lève `NumberFormatException` : intercepte-la.", "Lancer : `java Somme 24 18`."],
      python: ["Arguments : `sys.argv` (attention : `sys.argv[0]` est le nom du script).", "Conversion : `int(...)`, qui lève `ValueError`.", "Lancer : `python somme.py 24 18`."],
      c: ["Signature : `int main(int argc, char *argv[])` ; `argv[0]` est le nom du programme.", "Préfère `strtol` à `atoi` : avec le paramètre `endptr` tu peux détecter « 12abc ».", "Lancer : `./somme 24 18`."],
      cpp: ["Même signature qu'en C.", "Conversion : `std::stoi`, qui lève `std::invalid_argument` ou `std::out_of_range`."],
      go: ["Arguments : `os.Args` (`os.Args[0]` = nom du programme).", "Conversion : `n, err := strconv.Atoi(os.Args[1])`.", "Lancer : `go run . 24 18`."],
      rust: ["Arguments : `let args: Vec<String> = std::env::args().collect();`.", "Conversion : `args[1].parse::<i64>()` renvoie un `Result` : traite les deux cas avec `match`.", "Lancer : `cargo run -- 24 18`."],
    },
  },
  {
    id: "2", partie: "p1", titre: "Dessiner un triangle",
    notions: ["boucles imbriquées", "validation de saisie"],
    enonce: [
      "Réaliser un module `DessineTriangle` qui dessine, avec des astérisques, un triangle rectangle orienté vers le haut ou vers le bas. Il fournit deux fonctions :",
      "- `dessineTriangleBas(m)` : dessine le triangle orienté vers le bas, de taille `m`.",
      "- `dessineTriangleHaut(n)` : dessine le triangle orienté vers le haut, de taille `n`.",
      "Créer ensuite un programme de test `TestTriangle` :",
      "- l'utilisateur saisit une taille comprise entre 3 et 10, avec **3 essais au maximum** ; au-delà, le programme s'arrête ;",
      "- il choisit ensuite l'orientation : 0 pour le bas, 1 pour le haut.",
    ],
    sortie: "Donner la taille du triangle : 5\nVous avez choisi un triangle de 5 lignes\nDonner l'orientation (0 = bas, 1 = haut) : 1\nLe programme dessine un triangle orienté vers le haut :\n*\n**\n***\n****\n*****\nMerci d'avoir dessiné ce triangle.\n\n(orientation 0)\n*****\n****\n***\n**\n*",
    langs: {
      java: ["Deux classes : `DessineTriangle` (les deux méthodes d'instance) et `TestTriangle` (le `main`).", "Fin anticipée : `System.exit(0)`."],
      c: ["Deux fonctions `void dessine_triangle_haut(int n)` et `void dessine_triangle_bas(int m)`, dans `triangle.c` avec leur `triangle.h`."],
      go: ["Bonus : construis chaque ligne avec `strings.Repeat(\"*\", i)`, puis refais-le avec une boucle."],
      rust: ["Bonus : `\"*\".repeat(i)` existe ; fais d'abord la version avec boucles imbriquées."],
    },
  },
  {
    id: "3", partie: "p1", titre: "Série harmonique",
    notions: ["boucles", "division réelle"],
    enonce: [
      "Écrire un programme qui calcule la somme de la série harmonique : 1 + 1/2 + 1/3 + 1/4 + ... + 1/n.",
      "L'entier `n` est demandé à l'utilisateur. Il doit être compris entre 1 et 100 ; l'utilisateur a **5 essais**, sinon le programme s'arrête.",
      "Piège classique : dans la plupart des langages, `1/2` entre entiers vaut 0. Assure-toi de faire une division réelle.",
    ],
    sortie: "Donner n (1 à 100) : 4\nH(4) = 2.083333",
    langs: {
      c: ["Écris `1.0 / i` et non `1 / i`. Affichage : `printf(\"%.6f\\n\", h);`."],
      go: ["Go ne convertit jamais implicitement : `1.0 / float64(i)`."],
      rust: ["Rust ne convertit jamais implicitement : `1.0 / i as f64`."],
      python: ["`/` est toujours une division réelle en Python 3 (`//` est la division entière)."],
    },
  },
  {
    id: "4", partie: "p1", titre: "Équation du second degré",
    notions: ["conditions", "fonctions mathématiques"],
    enonce: [
      "Écrire un programme qui calcule les racines de l'équation ax² + bx + c = 0, où a, b et c sont saisis au clavier.",
      "Traiter les trois cas du discriminant Δ = b² − 4ac : Δ > 0 (deux racines), Δ = 0 (une racine double), Δ < 0 (pas de racine réelle).",
      "- Bonus 1 : si a = 0, résoudre l'équation du premier degré bx + c = 0, sans oublier b = 0.",
      "- Bonus 2 : si Δ < 0, afficher les deux racines complexes.",
    ],
    sortie: "a = 1\nb = -3\nc = 2\nΔ = 1 : deux racines réelles\nx1 = 2.0\nx2 = 1.0",
    langs: {
      java: ["`Math.sqrt(delta)`."],
      python: ["`math.sqrt` ; bonus complexe : `cmath.sqrt`."],
      c: ["`sqrt` dans `<math.h>` ; compile avec `-lm`. Bonus : `<complex.h>`."],
      cpp: ["`std::sqrt` ; bonus : `std::complex<double>`."],
      go: ["`math.Sqrt` ; bonus : `math/cmplx`."],
      rust: ["`delta.sqrt()` (méthode de `f64`)."],
    },
  },
  {
    id: "5", partie: "p1", titre: "Factorielle",
    notions: ["premier objet", "dépassement de capacité"],
    enonce: [
      "Réaliser un type `Factoriel` qui calcule la factorielle d'un entier. Prévoir deux opérations distinctes :",
      "- une qui fait **uniquement** le calcul ;",
      "- une qui **affiche** le résultat.",
      "Créer aussi un programme de test : l'entier est saisi au clavier, les entiers négatifs sont rejetés, et on se limite aux entiers de 0 à 20.",
      "Question : pourquoi 20 ? Que se passe-t-il pour 21! sur un entier 64 bits ? On verra plus loin (exercice 34) comment calculer la factorielle de grands nombres.",
    ],
    sortie: "Entier (0 à 20) : 5\n5! = 120\n\nEntier (0 à 20) : 20\n20! = 2432902008176640000",
    langs: {
      java: ["Type du résultat : `long`."],
      python: ["Les `int` Python ne débordent jamais : impose quand même la limite de 20 pour l'exercice, et constate ce qu'on obtient au-delà."],
      c: ["Pas de classe : `typedef struct { int n; uint64_t resultat; } Factoriel;` + `factoriel_calculer(Factoriel *f)` et `factoriel_afficher(const Factoriel *f)`.", "Type : `uint64_t` (`<stdint.h>`), affichage avec `PRIu64` (`<inttypes.h>`)."],
      cpp: ["Type : `std::uint64_t` ; `calculer()` et `afficher() const`."],
      go: ["Type : `uint64`. Constate le débordement silencieux pour 21!."],
      rust: ["Type : `u64`. En mode debug, 21! fait **paniquer** le programme (débordement) ; bonus : `checked_mul` qui renvoie `None`."],
    },
  },

  // ───────────────────────── Classes & objets ─────────────────────────
  {
    id: "6", partie: "p2", titre: "La classe Point",
    notions: ["constructeurs", "encapsulation", "visibilité"],
    enonce: [
      "Réaliser un type `Point` représentant un point du plan cartésien : deux coordonnées (abscisse et ordonnée) de type flottant, et une couleur de type octet (`byte`).",
      "Prévoir :",
      "- un constructeur à deux arguments (les coordonnées seules) ;",
      "- un constructeur à trois arguments (coordonnées et couleur), qui **appelle** le constructeur à deux arguments ;",
      "- un constructeur sans argument qui crée l'origine, et qui appelle lui aussi le constructeur à deux arguments ;",
      "- une méthode `translater(dx, dy)` qui déplace le point ;",
      "- une méthode `affiche()` qui affiche les propriétés du point ;",
      "- une méthode `coincide(autre)` qui renvoie vrai si les deux points ont les mêmes coordonnées.",
      "Écrire un programme de test dans le **même** module/package, puis un second dans un module/package **différent**. Note ce qui est accessible ou non.",
      "Réflexion : comparer deux flottants avec `==` est risqué. Pourquoi ? Propose une comparaison avec une tolérance (epsilon).",
    ],
    sortie: "Point (2.0, 3.0) couleur 5\nAprès translation : Point (3.5, 1.0) couleur 5\nCoïncide avec (3.5, 1.0) ? vrai",
    langs: {
      java: ["Constructeur chaîné : `this(x, y);` en première ligne.", "Dans l'autre package, observe la différence entre `public`, `protected`, (package) et `private`."],
      python: ["Un seul `__init__(self, x=0.0, y=0.0, couleur=0)`, plus `@classmethod origine(cls)`.", "Bonus : implémente `__eq__` en plus de `coincide`.", "Mets le second test dans un autre paquet et observe que `_x` reste accessible (ce n'est qu'une convention)."],
      c: ["`typedef struct { float x, y; unsigned char couleur; } Point;`", "`Point point_creer(float x, float y)`, `Point point_creer_couleur(float x, float y, unsigned char c)` (qui appelle `point_creer`), `Point point_origine(void)`.", "`void point_translater(Point *p, float dx, float dy)` (pointeur car on modifie), `bool point_coincide(const Point *a, const Point *b)`.", "« Autre package » : un autre `.c` qui n'inclut que `point.h`. Bonus : struct opaque pour vraiment cacher les champs."],
      cpp: ["Constructeurs délégués : `Point() : Point(0.f, 0.f) {}`.", "`std::uint8_t` pour la couleur (attention : `std::cout` l'affiche comme un caractère, convertis en `int`).", "Second test dans un autre `namespace`."],
      go: ["`type Point struct { x, y float32; couleur byte }`.", "`NewPoint(x, y)`, `NewPointCouleur(x, y, c)` (qui appelle `NewPoint`), `Origine()`.", "Test dans un autre package : seuls les identifiants commençant par une majuscule sont visibles."],
      rust: ["`struct Point { x: f32, y: f32, couleur: u8 }`.", "`Point::new(x, y)`, `Point::avec_couleur(x, y, c)` (qui appelle `new`), `Point::origine()`.", "`fn translater(&mut self, dx: f32, dy: f32)`, `fn coincide(&self, autre: &Point) -> bool`.", "Second test dans un autre module : seuls les éléments `pub` sont accessibles. Bonus : `#[derive(PartialEq)]`."],
    },
  },
  {
    id: "7", partie: "p2", titre: "La classe Cercle (objet membre)",
    notions: ["composition", "objet membre"],
    enonce: [
      "Réaliser un type `Cercle` représentant un cercle du plan, caractérisé par son **centre** (un objet `Point` de l'exercice 6) et son **rayon** (flottant double précision).",
      "- Un constructeur qui initialise correctement un cercle.",
      "- `surface()` : calcule la surface du cercle.",
      "- `affiche()` : affiche les caractéristiques du cercle (centre et rayon).",
      "- `imprime()` : affiche la surface du cercle.",
      "Réutilise ton `Point` au lieu de stocker x et y à nouveau.",
    ],
    sortie: "Cercle de centre (1.0, 2.0) et de rayon 3.0\nSurface : 28.274334",
    langs: {
      java: ["`Math.PI`."],
      python: ["`math.pi`."],
      c: ["`typedef struct { Point centre; double rayon; } Cercle;` en incluant `point.h`.", "`M_PI` n'est pas standard : définis ta propre constante."],
      cpp: ["C++20 : `std::numbers::pi` (`<numbers>`)."],
      go: ["`math.Pi`."],
      rust: ["`std::f64::consts::PI`."],
    },
  },
  {
    id: "8", partie: "p2", titre: "Gestion de stock",
    notions: ["conception", "collection d'objets"],
    enonce: [
      "Concevoir et implémenter une petite application de gestion de stock de marchandises.",
      "Proposition de conception (tu peux l'enrichir) :",
      "- un type `Produit` : référence, désignation, prix unitaire, quantité en stock, seuil d'alerte ;",
      "- un type `Stock` qui contient au plus N produits.",
      "Opérations attendues :",
      "- ajouter un produit (refuser une référence déjà présente) ;",
      "- rechercher un produit par sa référence ;",
      "- entrée de marchandise (réapprovisionner une quantité) ;",
      "- sortie de marchandise (refuser si la quantité est insuffisante) ;",
      "- valeur totale du stock ;",
      "- liste des produits sous leur seuil d'alerte.",
      "Termine par un menu console qui enchaîne ces opérations.",
    ],
    langs: {
      c: ["Tableau `Produit produits[MAX]` + compteur dans une struct `Stock` ; la recherche renvoie un pointeur ou `NULL`."],
      rust: ["La recherche renvoie `Option<&mut Produit>` ; la sortie de stock renvoie `Result<(), String>`."],
      go: ["La recherche renvoie `(*Produit, bool)` ; la sortie de stock renvoie une `error`."],
    },
  },
  {
    id: "9", partie: "p2", titre: "Compte bancaire",
    notions: ["conception", "règles métier"],
    enonce: [
      "Créer un type `CompteBancaire`. Un compte est défini par son solde, le nom et le prénom du titulaire, son sexe et le découvert autorisé.",
      "Imaginer et implémenter les opérations utiles, par exemple :",
      "- déposer un montant (refuser les montants négatifs ou nuls) ;",
      "- retirer un montant (refuser si le solde passerait sous −découvert) ;",
      "- virer un montant vers un autre compte ;",
      "- modifier le découvert autorisé ;",
      "- afficher le compte (« M. » ou « Mme » selon le sexe).",
      "Tester l'ensemble avec deux comptes.",
    ],
    langs: {
      c: ["Le virement prend deux pointeurs : `bool compte_virer(Compte *src, Compte *dst, double montant)`."],
      rust: ["Le virement : `fn virer(&mut self, dest: &mut Compte, montant: f64) -> Result<(), String>` ; essaie de virer un compte vers lui-même et lis l'erreur de l'emprunteur."],
      python: ["Bonus : représente le sexe par un `Enum`."],
    },
  },
  {
    id: "10", partie: "p2", titre: "Personnel administratif",
    notions: ["modélisation", "recherche"],
    enonce: [
      "Modéliser le personnel administratif d'une entreprise. Un employé est défini par son nom, son prénom, son âge, son sexe, son numéro de matricule et sa fonction.",
      "Ajouter un type `Personnel` (liste d'employés de taille maximale fixée) avec :",
      "- embaucher un employé (matricule unique) ;",
      "- licencier un employé à partir de son matricule ;",
      "- rechercher un employé par matricule ;",
      "- lister les employés d'une fonction donnée ;",
      "- calculer l'âge moyen.",
    ],
  },

  // ───────────────────────── Chaînes ─────────────────────────
  {
    id: "11", partie: "p3", titre: "Inverser une chaîne",
    notions: ["parcours", "méthodes d'instance vs statiques"],
    enonce: [
      "Écrire un type `ChaineInverse` qui inverse des chaînes de caractères (« bonjour » devient « ruojnob »).",
      "- `inverseChaine(s)` : reçoit une chaîne et renvoie la chaîne inversée ;",
      "- `imprimeChaine()` : affiche la chaîne inversée (stockée dans l'objet).",
      "Écrire un programme de test `TestChaine` qui construit un objet, inverse sa chaîne et affiche le résultat.",
      "Écrire ensuite une **seconde version**, `ChaineInverseStat`, sans objet : uniquement des fonctions de classe (statiques). Compare les deux approches.",
      "La fonction d'inversion de la bibliothèque standard est interdite.",
    ],
    sortie: "bonjour → ruojnob\nété → été",
    langs: {
      java: ["Pas de `StringBuilder.reverse()`. Version 2 : méthodes `static`."],
      python: ["Interdits : `s[::-1]` et `reversed()`. Version 2 : `@staticmethod` ou simple fonction de module ; discute de ce que la classe apporte encore."],
      c: ["Écris deux variantes : inversion **en place** (`void inverser(char *s)`) et inversion vers une **nouvelle** chaîne (`char *inverse(const char *s)` + `free`).", "« Statique » : version 1 = struct contenant la chaîne, version 2 = fonctions libres."],
      cpp: ["Version 2 : fonctions membres `static`, ou fonctions libres dans un `namespace`. Pas de `std::reverse`."],
      go: ["Teste avec « été » : inverser les octets casse l'UTF-8. Travaille sur `[]rune(s)`."],
      rust: ["Interdit : `.chars().rev()`. Construis un `Vec<char>` à la main puis parcours-le à l'envers.", "Version 2 : fonction associée sans `self` (`ChaineInverse::inverse(s)`)."],
    },
  },
  {
    id: "12", partie: "p3", titre: "Occurrences et voyelles",
    notions: ["comptage", "membres statiques"],
    enonce: [
      "Réaliser un type `NumberOcc` avec des fonctions de classe (statiques) :",
      "- `getNbOcc(s, c)` : nombre de fois où le caractère `c` apparaît dans `s` ;",
      "- `afficheNbOcc()` : affiche le dernier nombre d'occurrences calculé ;",
      "- `getNbVoy(chaine)` : nombre de voyelles (a e i o u y, minuscules et majuscules) ;",
      "- `afficheNbVoy()` : affiche le dernier nombre de voyelles calculé.",
      "Les fonctions d'affichage n'ont pas de paramètre : le dernier résultat doit donc être mémorisé quelque part. Où, et quels problèmes cela pose-t-il ?",
      "Bonus : compter aussi les voyelles accentuées (é, è, à...).",
    ],
    sortie: "getNbOcc(\"programmation\", 'm') = 2\ngetNbVoy(\"Bonjour le monde\") = 6",
    langs: {
      java: ["Le dernier résultat : champ `private static int`."],
      python: ["Variable de classe + `@staticmethod` / `@classmethod`."],
      c: ["Variable `static` au niveau du fichier (globale invisible des autres fichiers)."],
      cpp: ["Membre `static` (`inline static int dernier = 0;` en C++17)."],
      go: ["Variable de package non exportée."],
      rust: ["Rust décourage les variables globales mutables (il faudrait `unsafe` ou un `Mutex`). Adaptation : une struct `NumberOcc { dernier_occ, dernier_voy }` avec des méthodes `&mut self`. Explique pourquoi c'est préférable."],
    },
  },
  {
    id: "13", partie: "p3", titre: "Un mot est-il dans la liste ?",
    notions: ["recherche linéaire", "égalité de chaînes"],
    enonce: [
      "Écrire la fonction `existeDans(mot, liste)` (dans un type `ExisteMotDansListe`), qui renvoie vrai si `mot` est présent dans le tableau de chaînes `liste`, faux sinon.",
      "Écris toi-même la boucle de recherche, sans `contains` ni `in`.",
    ],
    sortie: "existeDans(\"go\", [\"java\", \"go\", \"rust\"]) = vrai\nexisteDans(\"c\", [\"java\", \"go\"]) = faux",
    langs: {
      java: ["Piège : compare avec `equals`, pas avec `==` (qui compare les références)."],
      c: ["`bool existe_dans(const char *mot, const char *liste[], size_t n)` ; égalité : `strcmp(a, b) == 0`."],
      rust: ["`fn existe_dans(mot: &str, liste: &[&str]) -> bool`."],
      go: ["`func ExisteDans(mot string, liste []string) bool`."],
    },
  },
  {
    id: "14", partie: "p3", titre: "Rechercher une sous-chaîne",
    notions: ["recherche naïve", "boucles imbriquées"],
    enonce: [
      "Réaliser un type `RechercheChaine` avec la fonction de classe `trouveChaine(chaine, chaineRecherchee)`, qui renvoie vrai si `chaineRecherchee` apparaît dans `chaine`.",
      "Implémente l'algorithme naïf : pour chaque position de départ possible, compare caractère par caractère.",
      "Interdit : `indexOf`, `contains`, `strstr`, `find`, `in`.",
      "Cas limites à tester : chaîne recherchée vide, chaîne recherchée plus longue que la chaîne, correspondance en toute fin de chaîne.",
    ],
    sortie: "trouveChaine(\"programmation\", \"gram\") = vrai\ntrouveChaine(\"programmation\", \"tionx\") = faux",
  },
  {
    id: "15", partie: "p3", titre: "Compter des sous-chaînes, extraire des chiffres",
    notions: ["réutilisation", "tableaux dynamiques"],
    enonce: [
      "Dans un même type, écrire :",
      "- a) `extraireSousChaine(chaine, sousChaine)` : renvoie le nombre de fois où `sousChaine` apparaît dans `chaine` ;",
      "- b) `extraireChiffres(s)` : renvoie un tableau contenant tous les chiffres présents dans `s`, dans l'ordre.",
      "Tu peux t'appuyer sur l'exercice 14.",
      "Question : dans « aaaa », combien de fois trouve-t-on « aa » ? 2 ou 3 ? Choisis une règle (avec ou sans chevauchement), documente-la, et bonus : propose les deux.",
    ],
    sortie: "extraireSousChaine(\"abcabcab\", \"ab\") = 3\nextraireChiffres(\"a1b22c3\") = [1, 2, 2, 3]",
    langs: {
      c: ["`int *extraire_chiffres(const char *s, size_t *taille)` : compte d'abord, alloue ensuite (ou alloue `strlen(s)` cases)."],
      rust: ["`fn extraire_chiffres(s: &str) -> Vec<u32>` ; bonus : `c.to_digit(10)`."],
      go: ["Renvoie un `[]int` construit avec `append`."],
    },
  },
  {
    id: "16", partie: "p3", titre: "Suffixe et extraction",
    notions: ["indices", "validation des bornes"],
    enonce: [
      "Écrire :",
      "- `estSuffixe(u, v)` : renvoie vrai si le mot `u` est un suffixe de `v` ;",
      "- `extraire(s, debut, fin)` : renvoie la sous-chaîne de `s` allant de l'indice `debut` à l'indice `fin − 1`.",
      "Sans `endsWith`, `substring` ni découpage par tranches : construis le résultat caractère par caractère.",
      "Décide du comportement si les indices sont invalides (négatifs, inversés, hors de la chaîne) et teste-le.",
    ],
    sortie: "estSuffixe(\"tion\", \"programmation\") = vrai\nextraire(\"bonjour\", 0, 3) = \"bon\"",
    langs: {
      rust: ["Indices invalides : renvoie `Option<String>`."],
      go: ["Indices invalides : renvoie `(string, error)`."],
      c: ["Indices invalides : renvoie `NULL`."],
    },
  },
  {
    id: "17", partie: "p3", titre: "Mettre un caractère en majuscule",
    notions: ["transformation", "codes de caractères"],
    enonce: [
      "Écrire :",
      "- une fonction qui reçoit une chaîne et un caractère, et renvoie une **nouvelle** chaîne où toutes les occurrences de ce caractère sont en majuscules ;",
      "- une fonction qui affiche le résultat de la précédente.",
      "Écrire un programme de test.",
      "Bonus : fais la conversion en majuscule toi-même à partir des codes ASCII ('a' → 'A' : soustraire 32).",
    ],
    sortie: "(\"bonjour\", 'o') → \"bOnjOur\"",
  },
  {
    id: "18", partie: "p3", titre: "Extraire les voyelles d'une phrase",
    notions: ["filtrage", "tableau de caractères"],
    enonce: [
      "Écrire une fonction qui reçoit une phrase et renvoie, sous forme de **tableau de caractères**, toutes les voyelles qu'elle contient, dans l'ordre d'apparition.",
    ],
    sortie: "\"Le Java est sympa\" → ['e', 'a', 'a', 'e', 'y', 'a']",
    langs: {
      c: ["Renvoie un `char *` alloué et sa taille par pointeur (ou une chaîne terminée par `'\\0'`)."],
      rust: ["Renvoie un `Vec<char>`."],
    },
  },
  {
    id: "21", partie: "p3", titre: "Recoder toCharArray",
    notions: ["conversion", "allocation"],
    enonce: [
      "Le but est d'**implémenter** la conversion d'une chaîne en tableau de caractères, pas d'utiliser celle de la bibliothèque.",
      "Réaliser un type `ToCharArray01` avec :",
      "- `charArrayFromString(s)` : construit le tableau des caractères de `s` (« bonjour » donne { 'b','o','n','j','o','u','r' }) ;",
      "- `afficheTabChar(t)` : affiche les éléments d'un tableau de caractères.",
    ],
    langs: {
      java: ["Interdit : `s.toCharArray()`. Utilise `s.length()` et `s.charAt(i)`."],
      python: ["Interdits : `list(s)` et les compréhensions qui l'imitent trop directement : une boucle avec `append`."],
      c: ["Une chaîne C **est** déjà un tableau de caractères. Adaptation : écris `char *copie_tableau(const char *s, size_t *taille)` qui alloue un tableau **sans** `'\\0'` et y copie les caractères sans `strcpy`/`strdup`. Explique la différence entre les deux."],
      cpp: ["De `std::string` vers `std::vector<char>` avec une boucle (pas le constructeur par itérateurs)."],
      go: ["Interdit : `[]rune(s)`. Parcours avec `for _, r := range s` et `append`. Compare avec `[]byte(s)` sur « été »."],
      rust: ["Interdit : `s.chars().collect()`. Une boucle `for c in s.chars()` qui fait `push`. Puis demande-toi pourquoi `s.as_bytes()` n'est pas équivalent."],
    },
  },
  {
    id: "22", partie: "p3", titre: "Découper une phrase en mots",
    notions: ["découpage", "délimiteurs"],
    enonce: [
      "Réaliser un type `CreateStringArray` qui crée un tableau de chaînes à partir d'une phrase. Les mots sont séparés par des espaces.",
      "- `arrayFromString(s)` : renvoie le tableau des mots de `s` ;",
      "- `afficheString(t)` : affiche les éléments d'un tableau de chaînes.",
      "Faire **deux versions** : d'abord avec l'outil de découpage de la bibliothèque standard, puis en codant le découpage toi-même.",
      "Gère les espaces multiples et les espaces en début ou fin de phrase.",
      "Bonus : accepter plusieurs délimiteurs (espace, virgule, point-virgule).",
    ],
    sortie: "\"je viens auprès de vous\" → [je] [viens] [auprès] [de] [vous]\nAvec les délimiteurs \",;\" :\n\"je viens, auprès de vous; en temps que\" → [je viens] [ auprès de vous] [ en temps que]",
    langs: {
      java: ["Version bibliothèque : `java.util.StringTokenizer` (`hasMoreTokens`, `nextToken`) ou `s.trim().split(\"\\\\s+\")`."],
      python: ["Version bibliothèque : `s.split()` (sans argument, gère déjà les espaces multiples) ; plusieurs délimiteurs : `re.split`."],
      c: ["Version bibliothèque : `strtok` (attention : elle **modifie** la chaîne et n'est pas réentrante, il faut travailler sur une copie).", "Résultat : `char **` + nombre de mots."],
      cpp: ["Version bibliothèque : `std::istringstream` + `>>` dans une boucle."],
      go: ["Version bibliothèque : `strings.Fields(s)` ; délimiteurs multiples : `strings.FieldsFunc`."],
      rust: ["Version bibliothèque : `s.split_whitespace()` ; délimiteurs multiples : `s.split(|c| c == ',' || c == ';')`."],
    },
  },
  {
    id: "32", partie: "p3", titre: "Statistiques de voyelles",
    notions: ["comptage", "décomposition en fonctions"],
    enonce: [
      "Écrire un programme qui lit un mot au clavier, indique le nombre de voyelles qu'il contient et, pour chaque voyelle, son nombre d'occurrences.",
      "Trois fonctions :",
      "- `numberVoy(mot)` : nombre total de voyelles ;",
      "- `numberOccVoy(mot, voyelle)` : nombre d'occurrences d'une voyelle donnée ;",
      "- `imprime(mot)` : affiche les résultats des deux précédentes.",
    ],
    sortie: "Mot : programmation\n5 voyelles\na : 2\no : 2\ni : 1",
  },
  {
    id: "39", partie: "p3", titre: "Normaliser un numéro de téléphone",
    notions: ["validation", "transformation"],
    enonce: [
      "Créer un type `NumberTelNorm` qui normalise un numéro de téléphone (stocké comme attribut) :",
      "- numéro à 9 chiffres : ajouter `(33)` en tête ;",
      "- numéro à 10 chiffres commençant par 0 : supprimer ce 0 et ajouter `(33)`.",
      "Prévoir :",
      "- un constructeur qui initialise le numéro ;",
      "- `controls()` : si le numéro contient des lettres, il est rejeté et on en redemande un jusqu'à obtenir un numéro sans lettre, qu'on renvoie ;",
      "- `getNumeroNormalise()` : renvoie le numéro normalisé ;",
      "- `imprime()` : affiche le numéro normalisé.",
      "Décide aussi quoi faire d'un numéro de longueur incorrecte.",
      "Bonus : rendre l'indicatif paramétrable (par exemple +221 pour le Sénégal).",
    ],
    sortie: "144553823  → (33)144553823\n0144553823 → (33)144553823\n01445a3823 → rejeté, nouveau numéro demandé",
  },
  {
    id: "43", partie: "p3", titre: "Plus de 4 lettres consécutives ?",
    notions: ["parcours avec état", "classes de caractères"],
    enonce: [
      "Écrire `isPlusDe4LettresConsecutives(s)`, qui renvoie vrai si `s` contient **au moins 5** lettres alphabétiques consécutives.",
      "Un seul parcours de la chaîne doit suffire (un compteur remis à zéro au bon moment).",
    ],
    sortie: "\"Bonjour\"   → vrai\n\"abc1defg2\" → faux\n\"ab cd ef\"  → faux",
    langs: {
      java: ["`Character.isLetter(c)`."],
      python: ["`c.isalpha()`."],
      c: ["`isalpha((unsigned char)c)` (`<ctype.h>`) ; le cast évite un comportement indéfini sur les caractères négatifs."],
      cpp: ["`std::isalpha(static_cast<unsigned char>(c))`."],
      go: ["`unicode.IsLetter(r)` sur des runes."],
      rust: ["`c.is_alphabetic()`."],
    },
  },

  // ───────────────────────── Tableaux & tris ─────────────────────────
  {
    id: "19", partie: "p4", titre: "Trier un tableau de chaînes",
    notions: ["tri", "comparaison lexicographique"],
    enonce: [
      "Réaliser un type `TriString` qui trie un tableau de chaînes par ordre croissant :",
      "- `triTabChaine(tab)` : renvoie le tableau trié ;",
      "- `afficheTabTri(tab)` : affiche les éléments d'un tableau de chaînes ;",
      "- `echange(t, i, j)` : échange les valeurs des cases `i` et `j`.",
      "Seules la **comparaison lexicographique** de deux chaînes et ta fonction `echange` sont autorisées pour écrire `triTabChaine`.",
      "Question : pourquoi « Kiwi » se retrouve-t-il avant « abricot » ? Comment faire un tri insensible à la casse ?",
    ],
    sortie: "[poire, abricot, banane, Kiwi] → [Kiwi, abricot, banane, poire]",
    langs: {
      java: ["Comparaison : `a.compareTo(b)` (négatif, 0 ou positif). Les méthodes peuvent être `private static` comme dans l'original."],
      python: ["Comparaison : les opérateurs `<` / `>` sur les `str`."],
      c: ["Comparaison : `strcmp(a, b)` ; `echange` permute des **pointeurs** `char *`, pas les caractères."],
      cpp: ["Comparaison : `a.compare(b)` ou `<` sur `std::string`."],
      go: ["Comparaison : `strings.Compare(a, b)` ou `<`."],
      rust: ["Comparaison : `a.cmp(&b)` (renvoie un `Ordering`) ou `<`.", "`echange` sur `&mut [String]` fait réfléchir : une variable temporaire impose un `clone()`, et l'emprunteur refuse deux `&mut` sur le même tableau. Solution sans copie : `split_at_mut` + `std::mem::swap`."],
    },
  },
  {
    id: "20", partie: "p4", titre: "Inverser un tableau",
    notions: ["indices", "nouveau tableau"],
    enonce: [
      "Réaliser un type `InverseArray` :",
      "- `inverseTab(t)` : renvoie un **nouveau** tableau inversé (le dernier élément devient le premier, et ainsi de suite) ;",
      "- `afficheTabInverse()` : affiche uniquement le dernier tableau inversé.",
      "Bonus : écris aussi une version qui inverse le tableau **en place**, sans tableau supplémentaire.",
    ],
    sortie: "[1, 2, 3, 4] → [4, 3, 2, 1]",
    langs: {
      rust: ["Le « dernier tableau inversé » mémorisé : stocke-le dans une struct plutôt que dans une globale (voir l'exercice 12)."],
    },
  },
  {
    id: "23", partie: "p4", titre: "Tri par sélection d'entiers",
    notions: ["tri par sélection", "décomposition"],
    enonce: [
      "Réaliser un type `TriTabEntier` qui trie **en place** un tableau d'entiers par ordre croissant avec le **tri par sélection**.",
      "- `echange(t, i, j)` : prend la valeur de la case `i`, y met la valeur de la case `j`, puis met l'ancienne valeur de `i` dans la case `j` ;",
      "- `indiceMIN(t, imin, imax)` : renvoie l'indice du plus petit élément entre les indices `imin` et `imax` ;",
      "- `tabTrie(t)` : trie le tableau en utilisant uniquement les deux fonctions précédentes.",
      "Principe : chercher le plus petit élément et le placer en première position, puis le plus petit des éléments restants en deuxième position, et ainsi de suite.",
      "Question : combien de comparaisons pour un tableau de n éléments ?",
    ],
    sortie: "[5, 2, 9, 1, 7]\n[1, 2, 9, 5, 7]   (1 placé)\n[1, 2, 9, 5, 7]   (2 déjà en place)\n[1, 2, 5, 9, 7]\n[1, 2, 5, 7, 9]",
  },
  {
    id: "24", partie: "p4", titre: "Tableau à partir d'un nombre aléatoire",
    notions: ["aléatoire", "allocation dynamique"],
    enonce: [
      "Écrire un programme qui tire au hasard un entier n (par exemple entre 1 et 20), puis crée un tableau contenant les entiers de 1 à n.",
      "Afficher n et le tableau. Lance le programme plusieurs fois : les résultats changent-ils ?",
    ],
    sortie: "n = 7\n[1, 2, 3, 4, 5, 6, 7]",
    langs: {
      java: ["`java.util.Random` (`nextInt(20) + 1`)."],
      python: ["`random.randint(1, 20)`."],
      c: ["`srand(time(NULL))` **une seule fois**, puis `rand() % 20 + 1` ; tableau alloué avec `malloc(n * sizeof(int))`."],
      cpp: ["`<random>` : `std::mt19937` + `std::uniform_int_distribution<int>(1, 20)` ; évite `rand()`."],
      go: ["`math/rand/v2` : `rand.IntN(20) + 1`."],
      rust: ["La bibliothèque standard n'a pas de générateur aléatoire : crate `rand` (`rand::random_range(1..=20)`), ou bonus : un petit générateur congruentiel maison initialisé avec `SystemTime`."],
    },
  },
  {
    id: "27", partie: "p4", titre: "Tableaux à deux dimensions",
    notions: ["tableaux 2D", "tableaux irréguliers"],
    enonce: [
      "Réaliser un type `TabMultiDim` contenant :",
      "- `affiche(t)` : affiche une ligne d'écran par ligne du tableau ;",
      "- `regulier(t)` : vrai si toutes les lignes ont la même taille ;",
      "- `sommeLignes(t)` : renvoie le tableau des sommes de chaque ligne ;",
      "- `somme(t1, t2)` : si `t1` et `t2` sont réguliers et de mêmes dimensions, renvoie leur somme (`r[i][j] = t1[i][j] + t2[i][j]`) ; sinon renvoie « rien ».",
      "Écrire un programme de test avec un tableau régulier et un tableau irrégulier.",
    ],
    sortie: "t = [[1, 2, 3], [4, 5], [6]]\nregulier(t) = faux\nsommeLignes(t) = [6, 9, 6]",
    langs: {
      java: ["`double[][]` peut être irrégulier ; « rien » = `null`."],
      python: ["Liste de listes ; « rien » = `None`."],
      c: ["Tableau irrégulier : `double **t` + un tableau `size_t *longueurs` + le nombre de lignes. « Rien » = `NULL`. Écris aussi la fonction de libération."],
      cpp: ["`std::vector<std::vector<double>>` ; « rien » = `std::optional<...>`."],
      go: ["`[][]float64` ; « rien » = `nil` (ou `(résultat, error)`)."],
      rust: ["`Vec<Vec<f64>>` en paramètre (`&[Vec<f64>]`) ; « rien » = `Option<Vec<Vec<f64>>>`."],
    },
  },
  {
    id: "29", partie: "p4", titre: "Utilitaires de tableaux",
    notions: ["génération", "parcours par indice"],
    enonce: [
      "Écrire un type `TabUtil` :",
      "- `genere(n)` : renvoie le tableau des n premiers nombres impairs ;",
      "- `somme(t1, t2)` : reçoit deux tableaux d'entiers de même taille et renvoie leur somme case par case (refuser des tailles différentes) ;",
      "- `affiche(t)` : affiche les éléments d'un tableau d'entiers ;",
      "- `incremente(t)` : ajoute à chaque case d'**indice impair** sa propre valeur (elle est donc doublée), et renvoie ce même tableau.",
      "Écrire un programme de test.",
    ],
    sortie: "genere(5)          = [1, 3, 5, 7, 9]\nincremente(...)    = [1, 6, 5, 14, 9]",
  },
  {
    id: "33", partie: "p4", titre: "Tri de chaînes en majuscules, avec contrôles",
    notions: ["validation", "tri", "normalisation"],
    enonce: [
      "Réaliser un type qui trie un tableau de chaînes, après les avoir toutes converties en **majuscules**.",
      "Avant le tri, contrôler chaque élément :",
      "- il ne doit contenir **aucun chiffre** ;",
      "- il ne doit pas dépasser **10 caractères**.",
      "Les éléments invalides sont signalés et écartés. Réutilise ton tri de l'exercice 19 ou 23.",
    ],
    sortie: "Entrée : [java, Python, c3po, rust, programmation]\nRejeté : c3po (contient un chiffre)\nRejeté : programmation (plus de 10 caractères)\nTrié  : [JAVA, PYTHON, RUST]",
  },

  // ───────────────────────── Objets composés ─────────────────────────
  {
    id: "25", partie: "p5", titre: "Point (révision)",
    notions: ["révision", "constructeurs"],
    enonce: [
      "**Révision de l'exercice 6, sans regarder ta solution.** Refais le type `Point` : coordonnées flottantes et couleur de type octet, trois constructeurs chaînés (deux arguments, trois arguments, sans argument pour l'origine), `translater`, `affiche` et `coincide`, avec un programme de test `TestPoint`.",
      "Compare ensuite avec ta première version : qu'as-tu fait différemment ?",
    ],
  },
  {
    id: "26", partie: "p5", titre: "Cercle (révision)",
    notions: ["révision", "composition"],
    enonce: [
      "**Révision de l'exercice 7, sans regarder ta solution.** Refais le type `Cercle` (centre de type `Point`, rayon double) avec un constructeur, `surface()` et `affiche()`.",
      "Bonus : ajoute `contient(p)` qui indique si un point est à l'intérieur du cercle.",
    ],
  },
  {
    id: "28", partie: "p5", titre: "Répertoire téléphonique",
    notions: ["collection d'objets", "recherche", "tri"],
    enonce: [
      "Réaliser un type `Repertoire` qui associe un numéro de téléphone (chaîne) à un nom.",
      "D'abord, un type `Abonne` identifié par un nom et un numéro (deux chaînes), avec un constructeur, `getNom()` et `getNumero()`.",
      "Le `Repertoire` dispose de :",
      "- un constructeur recevant le nombre maximal d'abonnés ;",
      "- `addAbonne(a)` : ajoute un abonné ; renvoie faux si le répertoire est plein, vrai sinon ;",
      "- `getNumero(nom)` : renvoie le numéro associé à un nom (et gère le cas où le nom est absent) ;",
      "- `getNAbonnes()` : nombre d'abonnés présents ;",
      "- `getAbonne(num)` : renvoie l'abonné de rang `num` ;",
      "- `echanger(t, i, j)` : permute deux abonnés d'un tableau ;",
      "- `abonnesTries()` : renvoie un tableau des abonnés par ordre alphabétique, en utilisant `echanger`.",
      "Écrire un programme de test.",
    ],
    langs: {
      java: ["Nom absent : renvoie `null`, ou mieux `Optional<String>`."],
      c: ["Le répertoire contient un tableau `Abonne *` alloué à la capacité demandée ; nom absent : renvoie `NULL`."],
      cpp: ["`std::vector<Abonne>` avec `reserve(max)` ; nom absent : `std::optional<std::string>`."],
      go: ["Nom absent : renvoie `(string, bool)`."],
      rust: ["`getNumero` renvoie `Option<&str>`, `getAbonne` renvoie `Option<&Abonne>` ; `abonnesTries` peut renvoyer un `Vec<&Abonne>` trié sans cloner."],
    },
  },
  {
    id: "30", partie: "p5", titre: "Étudiants et groupe de TD (sans héritage)",
    notions: ["constructeurs multiples", "agrégation"],
    enonce: [
      "Réaliser un type `Etudiant`. Il y a deux sortes d'étudiants : nationaux (nom, prénom, âge) et étrangers (on ajoute le pays d'origine).",
      "- Deux constructeurs ; le second appelle le premier.",
      "- `afficheNationaux()` affiche l'identité d'un étudiant national, `afficheEtrangers()` celle d'un étudiant étranger.",
      "- `getNom()`, `getPrenom()`, `getPays()`.",
      "Créer un type `GroupeTD` qui regroupe des étudiants : un tableau de taille maximale `maxEt` et le nombre d'étudiants effectivement présents.",
      "- Un constructeur qui crée un groupe vide.",
      "- `ajouterEtudiant(e)` : ajoute un étudiant sans dépasser la taille maximale.",
      "- `afficherListe()` : affiche tous les étudiants en appelant `afficheNationaux` ou `afficheEtrangers` selon le cas.",
      "Question de conception : le cahier d'origine proposait un compteur d'étudiants **statique**. Crée deux groupes : que se passe-t-il ? Corrige.",
      "L'exercice 36 refait ce modèle avec l'héritage : garde ta solution pour comparer.",
    ],
    langs: {
      c: ["Une seule struct avec un champ `pays` vide pour les nationaux (ou un booléen `etranger`)."],
      cpp: ["Champ `std::optional<std::string> pays`."],
      rust: ["Champ `pays: Option<String>` ; `afficherListe` fait un `match` dessus."],
      go: ["Pays vide `\"\"` pour un national, ou un pointeur `*string`."],
      python: ["`pays=None` par défaut dans `__init__`."],
    },
  },
  {
    id: "31", partie: "p5", titre: "Conjuguer un verbe du premier groupe",
    notions: ["chaînes", "boucle de contrôle"],
    enonce: [
      "Écrire un type `ConjugVerbe` qui conjugue au présent de l'indicatif un verbe du premier groupe (terminé par « er »). On suppose le verbe régulier : c'est à l'utilisateur d'éviter « manger » ou « commencer ».",
      "- Un constructeur qui initialise le verbe.",
      "- `control()` : tant que le verbe ne se termine pas par « er », demande un autre verbe à l'utilisateur ; renvoie le verbe valide.",
      "- `conjuguer()` : renvoie un tableau des 6 formes conjuguées.",
      "- `affiche(tab)` : affiche les éléments d'un tableau de chaînes.",
      "Bonus : élision devant une voyelle (« j'aime » au lieu de « je aime »).",
    ],
    code: [{ titre: "Programme de test", texte:
`public class TestConjugVerbe {
    public static void main(String[] args) {
        ConjugVerbe conj = new ConjugVerbe("attendre");
        conj.affiche(conj.conjuguer());
    }
}` }],
    sortie: "Le verbe n'est pas du premier groupe\nDonnez un autre verbe : faire\nLe verbe n'est pas du premier groupe\nDonnez un autre verbe : demander\nje demande\ntu demandes\nil/elle demande\nnous demandons\nvous demandez\nils/elles demandent",
    langs: {
      c: ["Radical : copie les `strlen(v) - 2` premiers caractères ; chaque forme : `snprintf(buf, taille, \"%s%s\", radical, terminaison)`."],
      rust: ["`verbe.ends_with(\"er\")` et `&verbe[..verbe.len() - 2]` (sûr ici car « er » est en ASCII)."],
    },
  },
  {
    id: "34", partie: "p5", titre: "Factorielle des grands nombres",
    notions: ["grands entiers", "noms qualifiés"],
    enonce: [
      "L'exercice 5 était limité à 20!. On veut maintenant calculer la factorielle de grands nombres (100!, 500!...).",
      "Réaliser un type `FactBigInteger` :",
      "- un constructeur qui reçoit le nombre (entier long) ;",
      "- `controls()` : vérifie que le nombre est positif et le renvoie ; un nombre négatif est refusé avec un message ;",
      "- `fact()` : renvoie la factorielle sous forme de grand entier ;",
      "- `afficher()` : affiche le résultat.",
    ],
    code: [{ titre: "Programme de test (Java, avec boîtes de dialogue)", texte:
`public class TestFactBigInteger {
    public static void main(String[] args) {
        int k = Integer.parseInt(
            javax.swing.JOptionPane.showInputDialog("Donnez un entier positif"));
        FactBigInteger fa = new FactBigInteger(k);
        javax.swing.JOptionPane.showMessageDialog(null, fa.fact(),
            "Résultat de la factorielle",
            javax.swing.JOptionPane.INFORMATION_MESSAGE, null);
    }
}` }],
    sortie: "25!  = 15511210043330985984000000\n-3   → le nombre est négatif",
    langs: {
      java: ["`java.math.BigInteger` : `BigInteger.ONE`, `multiply`, `BigInteger.valueOf(i)`.", "Contrainte : **aucune instruction `import`**, utilise les noms complets (`java.math.BigInteger`)."],
      python: ["Les `int` sont déjà illimités : `fact` est trivial (et `math.factorial` est interdit).", "Pour vraiment travailler, bonus : refais le calcul « à l'ancienne » avec une liste de chiffres, comme en C."],
      c: ["Pas de grands entiers : implémente-les. Un tableau de chiffres en base 10 (ou en base 10⁹ pour aller plus vite) et une fonction « multiplier par un petit entier » avec propagation de la retenue.", "Calcule 100! (158 chiffres) et vérifie ses premiers chiffres : 93326215443944..."],
      cpp: ["Écris une petite classe `BigInt` (`std::vector<std::uint32_t>` en base 10⁹) avec `operator*=(std::uint32_t)` et `operator<<`.", "Alternative : `boost::multiprecision::cpp_int`."],
      go: ["`math/big` : `r := big.NewInt(1)` puis `r.Mul(r, big.NewInt(i))`.", "Affichage par une boîte de dialogue : remplacé par la console."],
      rust: ["Pas de grands entiers dans la bibliothèque standard. Recommandé : implémente `struct BigUint(Vec<u32>)` en base 10⁹ avec une multiplication par `u32` et `impl Display`.", "Alternative : crate `num-bigint`.", "Remarque : `u128` va jusqu'à 34! seulement."],
    },
  },
  {
    id: "35", partie: "p5", titre: "Factorielles d'un tableau de chaînes",
    notions: ["conversion", "réutilisation"],
    enonce: [
      "Réaliser un type `ChaineFactoriel` qui reçoit un tableau de chaînes (« 5 », « 12 », « 30 »...), le convertit en tableau d'entiers longs, puis calcule la factorielle de chaque élément.",
      "- `converseStringToLong(ch)` : convertit le tableau de chaînes en tableau d'entiers longs ;",
      "- `calculFact(lg)` : renvoie le tableau des factorielles (grands entiers) ;",
      "- `imprime()` : affiche le tableau des résultats.",
      "Réutilise l'exercice 34 pour la factorielle.",
      "Bonus : fais la conversion chaîne → entier toi-même à partir des codes ASCII (`'7' - '0'` vaut 7), et rejette les chaînes qui ne sont pas des nombres.",
    ],
    sortie: "[\"5\", \"12\", \"25\"]\n5!  = 120\n12! = 479001600\n25! = 15511210043330985984000000",
  },

  // ───────────────────────── Héritage ─────────────────────────
  {
    id: "36", partie: "p6", titre: "Étudiants : héritage et polymorphisme",
    notions: ["héritage", "redéfinition", "polymorphisme"],
    enonce: [
      "Il y a trois sortes d'étudiants : nationaux (nom, prénom, âge), étrangers (on ajoute le pays d'origine) et sportifs (on ajoute le sport pratiqué).",
      "Un type de base `Etudiant`, et deux types `EtudiantEtranger` et `EtudiantSportif` qui en dérivent.",
      "- Un constructeur par type ; ceux des types dérivés appellent celui de la base.",
      "- `getNom()`, `getPrenom()`, `getAge()` dans `Etudiant`.",
      "- Une méthode `affiche()` dans chaque type ; celles des types dérivés appellent celle de la base.",
      "Un type `GroupeTD` : un tableau d'étudiants de taille maximale `maxEt` et leur nombre.",
      "- Un constructeur qui reçoit la taille maximale et crée un groupe vide.",
      "- `ajouterEtudiant(e)` : ajoute n'importe quel étudiant sans dépasser la taille maximale.",
      "- `afficherListe()` : affiche tous les étudiants en appelant simplement `affiche()` sur chacun (polymorphisme).",
      "Compare avec ta solution de l'exercice 30 : qu'a-t-on gagné ?",
    ],
    code: [{ titre: "Programme de test", texte:
`public class TestGroupeTD {
    public static void main(String[] args) {
        GroupeTD gt = new GroupeTD(4);
        gt.ajouterEtudiant(new Etudiant("Sene", "Pierre", 19));
        gt.ajouterEtudiant(new EtudiantSportif("Fall", "Fatou", 18, "Natation"));
        gt.ajouterEtudiant(new EtudiantEtranger("Ndiaye", "Moussa", 20, "Mali"));
        gt.afficherListe();
    }
}` }],
    sortie: "Étudiant : nom = Sene, prénom = Pierre, âge = 19\nÉtudiant sportif : nom = Fall, prénom = Fatou, âge = 18, sport = Natation\nÉtudiant étranger : nom = Ndiaye, prénom = Moussa, âge = 20, pays d'origine = Mali",
    langs: {
      java: ["`super(nom, prenom, age)` dans les constructeurs, `super.affiche()` + `@Override` dans les redéfinitions."],
      python: ["`super().__init__(...)` et `super().affiche()`."],
      c: ["`typedef struct Etudiant { char nom[32], prenom[32]; int age; void (*affiche)(const struct Etudiant *); } Etudiant;`", "`typedef struct { Etudiant base; char sport[32]; } EtudiantSportif;` : grâce à `base` en premier champ, un `EtudiantSportif *` peut être vu comme un `Etudiant *`.", "Le groupe stocke des `Etudiant *` ; `afficherListe` appelle `e->affiche(e)`."],
      cpp: ["`virtual void affiche() const` dans la base, `void affiche() const override` dans les dérivées, `virtual ~Etudiant() = default;`.", "Groupe : `std::vector<std::unique_ptr<Etudiant>>`."],
      go: ["Embedding : `type EtudiantSportif struct { Etudiant; Sport string }`.", "Interface `Affichable { Affiche() }` ; le groupe stocke des `Affichable`.", "L'appel au parent : `s.Etudiant.Affiche()`."],
      rust: ["Trait `Affichable { fn affiche(&self); }` ; `struct EtudiantSportif { base: Etudiant, sport: String }`.", "« Appeler le parent » : `self.base.affiche()`.", "Groupe : `Vec<Box<dyn Affichable>>`. Bonus : refais-le avec un `enum` et compare."],
    },
  },
  {
    id: "37", partie: "p6", titre: "Identité ou égalité ?",
    notions: ["égalité", "références"],
    enonce: [
      "Deux points créés séparément avec les mêmes coordonnées sont-ils « égaux » ? Ce programme Java répond… faux :",
      "Explique pourquoi, puis corrige le type `Point` pour que la comparaison donne vrai.",
      "Dans ton langage : écris l'équivalent, observe le résultat (vrai, faux, ou refus de compiler) et explique la différence entre **identité** (même objet en mémoire) et **égalité** (même valeur).",
    ],
    code: [{ titre: "Programme d'origine (Java)", texte:
`public class Point {
    private int x, y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        System.out.println("Comparaison de deux points : " + a.equals(b));  // false
    }
}` }],
    langs: {
      java: ["`equals` hérité d'`Object` compare les **références**. Redéfinis `equals(Object o)` (test de type, cast, comparaison des champs) **et** `hashCode()`.", "Bonus : un `record Point(int x, int y)` fournit tout cela automatiquement."],
      python: ["Sans `__eq__`, `==` compare l'identité (comme `is`). Implémente `__eq__` (et `__hash__` si les points vont dans un `set`).", "Bonus : `@dataclass(frozen=True)`."],
      c: ["L'opérateur `==` ne compile pas sur des structs. Compare `&a == &b` (identité) et écris `bool point_egal(const Point *a, const Point *b)`.", "Piège : `memcmp` sur des structs peut échouer à cause des octets de remplissage (padding)."],
      cpp: ["Avant C++20, `a == b` ne compile pas sans `operator==`. Compare `&a == &b` (identité).", "C++20 : `bool operator==(const Point&) const = default;`."],
      go: ["Surprise : `==` sur deux **structs** compare les champs (vrai), mais sur deux **pointeurs** `*Point` compare les adresses (faux). Montre les deux cas."],
      rust: ["`a == b` ne compile pas sans le trait `PartialEq` : ajoute `#[derive(PartialEq)]` ou écris `impl PartialEq`.", "Identité : `std::ptr::eq(&a, &b)`."],
    },
  },
  {
    id: "38", partie: "p6", titre: "Interface Affichable",
    notions: ["interfaces", "collection polymorphe"],
    enonce: [
      "On donne une interface `Affichable` avec une seule opération : `affiche()`.",
      "Définir deux types `Entier` et `Flottant` qui l'implémentent. Chacun a un constructeur et un champ `valeur`, et `affiche` imprime la valeur.",
      "Créer un type `HerPoly` :",
      "- un tableau d'`Affichable` pouvant contenir des entiers et des flottants, et le nombre actuel d'éléments ;",
      "- un constructeur qui reçoit la capacité ;",
      "- `ajoutValeur(a)` : ajoute un entier ou un flottant ;",
      "- `affiche()` : affiche tous les éléments.",
    ],
    code: [{ titre: "Programme de test", texte:
`interface Affichable {
    void affiche();
}

public class TestHerPoly {
    public static void main(String[] args) {
        HerPoly h = new HerPoly(3);
        h.ajoutValeur(new Entier(25));
        h.ajoutValeur(new Flottant(1.25f));
        h.ajoutValeur(new Entier(42));
        h.affiche();
    }
}` }],
    sortie: "Entier de valeur 25\nFlottant de valeur 1.25\nEntier de valeur 42",
    langs: {
      python: ["Interface : `class Affichable(ABC)` avec `@abstractmethod def affiche(self)`. Puis demande-toi si le « duck typing » ne suffit pas."],
      c: ["Solution idiomatique : union étiquetée `typedef struct { enum { ENTIER, FLOTTANT } type; union { int i; float f; } v; } Valeur;` et un `switch` dans `affiche`.", "Bonus : la version avec pointeur de fonction (`void (*affiche)(const void *)`), et compare."],
      cpp: ["`struct Affichable { virtual void affiche() const = 0; virtual ~Affichable() = default; };`", "Bonus : refais-le avec `std::variant<int, float>` + `std::visit`."],
      go: ["`type Affichable interface { Affiche() }` ; `Entier` et `Flottant` la satisfont implicitement."],
      rust: ["Version 1 : `trait Affichable` + `Vec<Box<dyn Affichable>>`.", "Version 2 : `enum Valeur { Entier(i32), Flottant(f32) }` + `match`. Quand préférer l'une ou l'autre ?"],
    },
  },
  {
    id: "44", partie: "p6", titre: "Point encapsulé, toString et surcharge",
    notions: ["encapsulation", "surcharge", "représentation textuelle"],
    enonce: [
      "Réaliser un type `Point` dont les coordonnées entières `x` et `y` sont bien encapsulées. Prévoir :",
      "- un constructeur qui initialise les deux champs ;",
      "- un constructeur **de copie** qui reçoit un `Point` et appelle le premier ;",
      "- la représentation textuelle (`toString`) de l'objet, par exemple `Point: (10, 10)` ;",
      "- `getX()`, `getY()`, `setX(v)`, `setY(v)` ;",
      "- `deplace(dx, dy)` : translate le point ;",
      "- une **surcharge** `deplace(p)` qui translate le point des coordonnées d'un autre point ;",
      "- `affiche()`, qui utilise la représentation textuelle.",
      "Ce type sert aux exercices 45 et 46.",
    ],
    langs: {
      java: ["Redéfinis `public String toString()` d'`Object` avec `@Override`."],
      python: ["Représentation : `__str__` (et `__repr__`).", "Pas de surcharge en Python : soit `deplace(self, dx_ou_point, dy=None)` avec `isinstance`, soit deux méthodes (`deplace` et `deplace_par`). Discute du meilleur choix.", "Encapsulation : `@property` pour `x` et `y`."],
      c: ["Représentation : `void point_vers_chaine(const Point *p, char *buf, size_t taille)` avec `snprintf`.", "Pas de surcharge : `point_deplace` et `point_deplace_par`. Bonus : `_Generic` (C11) pour simuler la surcharge."],
      cpp: ["Surcharge native. Représentation : `std::string to_string() const` et `friend std::ostream& operator<<(std::ostream&, const Point&)`.", "Le constructeur de copie existe déjà par défaut : écris-le quand même une fois pour comprendre."],
      go: ["Représentation : méthode `String() string` (interface `fmt.Stringer`, utilisée automatiquement par `fmt.Println`).", "Pas de surcharge : `Deplace(dx, dy)` et `DeplacePar(p Point)`."],
      rust: ["Représentation : `impl fmt::Display for Point`.", "Pas de surcharge : `deplace(dx, dy)` et `deplace_par(&p)`. Copie : `#[derive(Clone, Copy)]`, ou un constructeur `Point::depuis(&p)`."],
    },
  },
  {
    id: "45", partie: "p6", titre: "Disque (composition)",
    notions: ["composition", "délégation"],
    enonce: [
      "En utilisant le `Point` de l'exercice 44, réaliser un type `Disque` caractérisé par son **centre** (un `Point`) et son **rayon** (entier). Prévoir :",
      "- un constructeur prenant les coordonnées du centre `cx`, `cy` et le rayon `r` ;",
      "- la représentation textuelle, qui **réutilise** celle du `Point` pour le centre, par exemple `Disque: (40, 45): 12` ;",
      "- `deplace(dx, dy)` : translate le disque en **délégant** au `deplace` du centre ;",
      "- `surface()` : renvoie l'aire du disque (avec la constante π de la bibliothèque) ;",
      "- `affiche()`, qui utilise la représentation textuelle.",
    ],
  },
  {
    id: "46", partie: "p6", titre: "Anneau (héritage)",
    notions: ["héritage", "redéfinition", "polymorphisme"],
    enonce: [
      "Un anneau est un disque (héritage) avec en plus un rayon intérieur `prayon`. Réaliser un type `Anneau` :",
      "- un constructeur basé sur celui du `Disque` (vérifier que `prayon` est plus petit que le rayon) ;",
      "- la représentation textuelle, qui appelle celle du `Disque` puis ajoute le rayon intérieur, par exemple `Anneau: (0, 0): 12:6` ;",
      "- `deplace(dx, dy)`, basé sur celui du `Disque` ;",
      "- `affiche()`, qui utilise la représentation textuelle.",
      "Bonus : la surface d'un anneau est π(R² − r²) : redéfinis `surface()`.",
    ],
    code: [{ titre: "Programme de test (exercices 44 à 46)", texte:
`public class Test {
    public static void main(String[] args) {
        Point p = new Point(10, 10);    p.affiche();
        p.deplace(10, 10);              p.affiche();
        p.deplace(new Point(14, 14));   p.affiche();

        Disque d = new Disque(0, 5, 12);
        d.deplace(40, 40);              d.affiche();
        System.out.println("surface du disque " + d.surface());
        d.deplace(100, 100);            d.affiche();

        d = new Anneau(0, 0, 12, 6);    d.affiche();   // polymorphisme
        d = new Anneau(5, 5, 45, 15);   d.affiche();
    }
}` }],
    sortie: "Point: (10, 10)\nPoint: (20, 20)\nPoint: (34, 34)\nDisque: (40, 45): 12\nsurface du disque 452.3893421169302\nDisque: (140, 145): 12\nAnneau: (0, 0): 12:6\nAnneau: (5, 5): 45:15",
    langs: {
      c: ["`typedef struct { Disque base; int prayon; } Anneau;` ; pour la ligne « polymorphisme », ajoute un pointeur de fonction `vers_chaine` dans `Disque`."],
      cpp: ["`class Anneau : public Disque` ; `to_string()` doit être `virtual` dans `Disque` pour que `d->affiche()` affiche bien un anneau."],
      go: ["`type Anneau struct { Disque; prayon int }` : `Deplace` est promu automatiquement.", "Piège : `Disque.Affiche()` appelle `Disque.String()`, jamais celle d'`Anneau`. Pour la ligne « polymorphisme », passe par une interface `Forme { String() string; Deplace(dx, dy int) }`."],
      rust: ["`struct Anneau { disque: Disque, prayon: i32 }` + un trait `Forme { fn deplace(&mut self, dx: i32, dy: i32); fn surface(&self) -> f64; }` + `Display`.", "La variable `d` devient `let mut d: Box<dyn Forme> = ...`."],
      python: ["`class Anneau(Disque)` et `super().__str__()`."],
    },
  },

  // ───────────────────────── Listes dynamiques ─────────────────────────
  {
    id: "40", partie: "p7", titre: "Trier une liste dynamique de chaînes",
    notions: ["liste dynamique", "tri par sélection"],
    enonce: [
      "Un tableau a une taille fixe : impossible d'y ajouter un élément de plus. Une **liste dynamique** grandit à la demande.",
      "On veut trier une liste dynamique de chaînes par sélection. Compléter les trois fonctions :",
      "- `indiceDuPlusPetit(v, imin, imax)` : indice du plus petit élément de `v` entre `imin` et `imax` ;",
      "- `echanger(v, i, j)` : échange les éléments d'indices `i` et `j` ;",
      "- `triSelectionEchange(v, n)` : trie par ordre croissant les `n` premiers éléments de `v`.",
    ],
    code: [{ titre: "Squelette (Java)", texte:
`import java.util.ArrayList;

public class TriArrayChaine {

    /** Rend l'indice du plus petit élément de v entre imin et imax (imin < imax). */
    public static int indiceDuPlusPetit(ArrayList<String> v, int imin, int imax) {
        // à compléter
    }

    /** Échange les éléments d'indices i et j. */
    public static void echanger(ArrayList<String> v, int i, int j) {
        // à compléter
    }

    /** Trie par ordre croissant les n premiers éléments de v. */
    public static void triSelectionEchange(ArrayList<String> v, int n) {
        // à compléter
    }

    public static void main(String[] args) {
        ArrayList<String> v = new ArrayList<>();
        v.add("bonjour"); v.add("durand"); v.add("au revoir");
        v.add("dupond");  v.add("durand");
        triSelectionEchange(v, v.size());
        System.out.println(v);
    }
}` }],
    sortie: "[au revoir, bonjour, dupond, durand, durand]",
    langs: {
      java: ["`get(i)` récupère un élément, `set(i, o)` le remplace. Le cahier d'origine utilisait des `ArrayList` sans type (bruts) : préfère `ArrayList<String>`."],
      python: ["La `list` est déjà dynamique : l'exercice porte surtout sur l'algorithme (pas de `sort`)."],
      c: ["Écris d'abord le vecteur dynamique : `typedef struct { char **data; size_t taille, capacite; } Vecteur;` avec `vecteur_ajouter` (qui double la capacité avec `realloc`) et `vecteur_liberer`.", "C'est le vrai cœur de l'exercice en C."],
      cpp: ["`std::vector<std::string>` (`push_back`, `operator[]`)."],
      go: ["`[]string` + `append` ; observe `len` et `cap` grandir au fil des ajouts."],
      rust: ["`Vec<String>` ; écris `echanger` toi-même (sans `v.swap`)."],
    },
  },
  {
    id: "41", partie: "p7", titre: "Maximum d'une liste de nombres hétérogènes",
    notions: ["types numériques", "hétérogénéité", "égalité de valeurs"],
    enonce: [
      "Une liste contient des nombres de types **différents** : entier, réel double, entier court, réel simple...",
      "- `getMaximum(v)` : renvoie le plus grand nombre d'une liste non vide ;",
      "- `remplacer(v, ancien, nouveau)` : remplace toutes les occurrences de `ancien` par `nouveau`. La comparaison porte sur la **valeur** : un 10 court est égal à un 10 entier.",
      "Question piège : dans le cahier d'origine, l'appel était `remplacer(v, \"10\", \"144\")` sur une liste non typée. Que se passe-t-il ? Pourquoi le maximum ne change-t-il pas ? Corrige l'appel.",
    ],
    code: [{ titre: "Programme de test (Java)", texte:
`ArrayList<Number> v = new ArrayList<>();
v.add(6);  v.add(8.2);  v.add((short) 10);  v.add(-16);  v.add(4f);

System.out.println(getMaximum(v));   // 10
remplacer(v, (short) 10, 144);
System.out.println(getMaximum(v));   // 144` }],
    sortie: "10\n144",
    langs: {
      java: ["Type commun : `Number` ; comparaison avec `doubleValue()`.", "Piège : `Short.valueOf(10).equals(10)` vaut **faux** (types différents) : compare les valeurs."],
      python: ["Une liste mixte `int`/`float` est naturelle. Pimente-la avec `fractions.Fraction` et `decimal.Decimal`."],
      c: ["Union étiquetée : `typedef struct { enum { I32, F64, I16, F32 } type; union { int32_t i; double d; int16_t s; float f; } v; } Nombre;` + `double nombre_valeur(const Nombre *n)`."],
      cpp: ["`std::vector<std::variant<int, double, short, float>>` + `std::visit` pour obtenir la valeur en `double`."],
      go: ["Version 1 : `[]any` + `switch x := v.(type)`. Version 2 : une interface `Nombre { Valeur() float64 }`."],
      rust: ["`enum Nombre { I32(i32), F64(f64), I16(i16), F32(f32) }` + `fn valeur(&self) -> f64`.", "Remarque : `f64` n'implémente pas `Ord` (à cause de NaN), d'où `partial_cmp` ou une comparaison manuelle."],
    },
  },
  {
    id: "42", partie: "p7", titre: "Le même tri pour les entiers : généricité",
    notions: ["généricité", "réutilisation"],
    enonce: [
      "Dans l'exercice 40, ajouter `indiceDuPlusPetitEntier(v, imin, imax)` pour une liste d'**entiers**, puis trier la liste ci-dessous.",
      "Tu viens de dupliquer du code. Écris ensuite **une seule** version générique du tri qui fonctionne pour les chaînes comme pour les entiers.",
    ],
    code: [{ titre: "À ajouter dans main (Java)", texte:
`ArrayList<Integer> w = new ArrayList<>();
w.add(7); w.add(17); w.add(3); w.add(8); w.add(0);
triSelectionEchange(w, w.size());
System.out.println(w);` }],
    sortie: "[0, 3, 7, 8, 17]",
    langs: {
      java: ["Générique : `static <T extends Comparable<T>> void triSelectionEchange(ArrayList<T> v, int n)`."],
      python: ["Le tri est déjà générique (duck typing). Bonus : annote-le avec `TypeVar` borné et vérifie avec mypy."],
      c: ["Générique à la manière de `qsort` : `void tri(void *base, size_t n, size_t taille, int (*cmp)(const void *, const void *))`, avec un échange octet par octet."],
      cpp: ["`template <typename T> void tri(std::vector<T>& v)` ; C++20 : contrainte `std::totally_ordered<T>`."],
      go: ["`func Tri[T cmp.Ordered](v []T)` (paquet `cmp`, Go 1.21+)."],
      rust: ["`fn tri<T: PartialOrd>(v: &mut [T])`."],
    },
  },

  // ───────────────────────── Erreurs ─────────────────────────
  {
    id: "47", partie: "p8", titre: "Factorielle avec gestion d'erreur",
    notions: ["erreur personnalisée", "lancer / traiter"],
    enonce: [
      "Réaliser un type `FactException` qui calcule la factorielle d'un entier naturel avec une bonne gestion des erreurs. L'entier est l'unique attribut de l'objet.",
      "- Un constructeur à un argument.",
      "- `fact()` : calcule la factorielle. Si l'entier est strictement négatif, c'est une erreur : crée un type d'erreur dédié (par exemple `NombreNegatif`), signale-la, puis traite-la.",
      "- `affiche()` : affiche le résultat.",
      "Écrire un programme de test avec un nombre valide et un nombre négatif.",
    ],
    sortie: "5! = 120\nErreur : factorielle d'un nombre négatif (-3)",
  },
  {
    id: "48", partie: "p8", titre: "Racine carrée avec gestion d'erreur",
    notions: ["erreurs du domaine mathématique"],
    enonce: [
      "Réaliser un type `RacineCarreException` qui calcule la racine carrée d'un nombre positif, avec une bonne gestion des erreurs. Le nombre est l'unique attribut de l'objet.",
      "- Un constructeur à un argument.",
      "- `racine()` : calcule la racine carrée ; un nombre strictement négatif provoque une erreur arithmétique, signalée puis traitée.",
      "- `affiche()` : affiche le résultat.",
      "Question : que renvoie la fonction racine carrée de ta bibliothèque pour −1 ? Lève-t-elle une erreur toute seule ?",
    ],
    sortie: "√16 = 4.0\nErreur : racine carrée d'un nombre négatif (-4.0)",
    langs: {
      java: ["Utilise `ArithmeticException`. Remarque : `Math.sqrt(-1)` renvoie `NaN` sans erreur, c'est à toi de la lever."],
      python: ["`math.sqrt(-1)` lève déjà `ValueError` : teste avant et lève ta propre erreur avec un message clair."],
      c: ["`sqrt(-1)` renvoie `NaN` et peut positionner `errno = EDOM`. Renvoie un code d'erreur et le résultat par pointeur."],
      cpp: ["Lève `std::domain_error`."],
      go: ["`math.Sqrt(-1)` renvoie `NaN` : renvoie `(float64, error)`."],
      rust: ["`(-1.0_f64).sqrt()` renvoie `NaN` sans paniquer : renvoie `Result<f64, ErreurRacine>`."],
    },
  },
  {
    id: "49", partie: "p8", titre: "Division par les éléments d'un tableau",
    notions: ["division par zéro", "arrêt contrôlé"],
    enonce: [
      "Écrire un programme qui divise un entier `n` par chacun des éléments d'un tableau d'entiers, en gérant la division par zéro.",
      "- `diviser(tab, n)` : renvoie un tableau `tabres` avec `tabres[i] = n / tab[i]`. Si un élément est nul, afficher un message d'erreur clair et arrêter le programme.",
      "- `affiche(t)` : affiche les éléments d'un tableau.",
      "- Le programme principal.",
    ],
    sortie: "n = 100, tab = [5, 10, 4]  → [20, 10, 25]\nn = 100, tab = [5, 0, 4]   → Erreur : division par zéro (indice 1)",
    langs: {
      java: ["La division entière par zéro lève `ArithmeticException` automatiquement : intercepte-la."],
      python: ["`ZeroDivisionError`."],
      c: ["Division entière par zéro = **comportement indéfini** (souvent un plantage SIGFPE) : il faut tester avant de diviser."],
      cpp: ["Même chose qu'en C : aucune exception n'est levée. Teste et lève toi-même `std::domain_error`."],
      go: ["Division entière par zéro = `panic` à l'exécution. Version 1 : tester avant. Version 2 : `defer` + `recover` pour l'intercepter (et explique pourquoi la version 1 est préférable)."],
      rust: ["Division par zéro = `panic`. Utilise `n.checked_div(x)`, qui renvoie `None`."],
    },
  },
  {
    id: "50", partie: "p8", titre: "Suite d'indices et division sûre",
    notions: ["erreurs personnalisées", "validation"],
    enonce: [
      "Réaliser un type qui crée un tableau d'entiers à partir d'un entier saisi par l'utilisateur.",
      "- `suite(n)` (fonction de classe) : renvoie un tableau de taille `n` dont chaque case contient son propre indice. Un `n` négatif provoque une erreur d'un type dédié.",
      "- `imprime(t)` : affiche un tableau.",
      "- `division(a, b)` (fonction de classe) : renvoie `a / b`, avec une erreur si le diviseur est nul. (Le cahier d'origine l'appelait par erreur `addition`.)",
      "- `affiche()` : affiche le résultat de la division.",
    ],
    sortie: "n = 5 → [0, 1, 2, 3, 4]\nn = -2 → Erreur : taille négative\n17 / 5 = 3\n17 / 0 → Erreur : division par zéro",
  },

  // ───────────────────────── Concurrence ─────────────────────────
  {
    id: "51", partie: "p9", titre: "Banque : opérations synchronisées",
    notions: ["section critique", "exclusion mutuelle", "documentation"],
    enonce: [
      "Réaliser un type `Banque` (un compte) : prénom et nom du titulaire, numéro de compte, solde initial et découvert. Prévoir :",
      "- un constructeur ;",
      "- `crediter(montant)` et `debiter(montant)` ;",
      "- les accesseurs (prénom, nom, solde, découvert) et une méthode pour modifier le découvert ;",
      "- `getHistorique()` : affiche le solde, et mieux encore la liste des opérations effectuées.",
      "Le client peut créditer ou débiter, et ces deux opérations ne doivent **jamais** s'exécuter en même temps, sinon le solde serait faux.",
      "Créer deux threads : `ProcessBankCredit` (crédit) et `ProcessBankDebit` (débit).",
      "Explique dans des **commentaires de documentation** précis les dispositions prises pour que le solde ne soit jamais corrompu.",
      "### Expérience à faire",
      "Lance 2 threads qui font chacun 100 000 crédits de 1, d'abord **sans** synchronisation : le solde final vaut-il 200 000 ? Ajoute ensuite la synchronisation et recommence.",
    ],
    langs: {
      java: ["Méthodes `synchronized` ou blocs `synchronized (compte) { ... }`. Commentaires `/** ... */` (Javadoc)."],
      python: ["Un `threading.Lock` dans le compte, avec `with self._verrou:`. Documentation : docstrings.", "Pour voir la course sans verrou, découpe l'opération : `s = self.solde; time.sleep(0); self.solde = s + m`."],
      c: ["`pthread_mutex_t` dans la struct ; `pthread_mutex_lock`/`unlock` autour de chaque modification. Documentation : commentaires Doxygen `/** ... */`.", "Lance l'expérience avec `-fsanitize=thread`."],
      cpp: ["`mutable std::mutex m_;` + `std::lock_guard<std::mutex> verrou(m_);` dans chaque méthode. Documentation : Doxygen."],
      go: ["`sync.Mutex` dans la struct (`c.mu.Lock(); defer c.mu.Unlock()`). Documentation : commentaires godoc au-dessus des types.", "Lance l'expérience avec `go run -race .`."],
      rust: ["Essaie de partager un `&mut Compte` entre deux threads : lis l'erreur du compilateur. Puis utilise `Arc<Mutex<Compte>>`. Documentation : `///` (rustdoc), générée avec `cargo doc --open`.", "L'expérience « sans synchronisation » est impossible en Rust sûr : explique pourquoi c'est une bonne nouvelle."],
    },
  },
  {
    id: "52", partie: "p9", titre: "Course de 1000 m",
    notions: ["threads", "join", "aléatoire"],
    enonce: [
      "Simuler une course de 1000 m où chaque coureur est un thread. Un coureur n'est identifié que par son nom.",
      "- Un constructeur.",
      "- Le comportement du thread : pour chaque tranche de 100 m, une pause aléatoire d'au plus 1 seconde, puis l'affichage du passage (`300 m par Paul`).",
      "Dans le programme principal : lancer Jean et Paul, attendre qu'ils aient **tous deux** terminé, puis seulement lancer « Toto ».",
      "Bonus : annoncer le vainqueur. C'est une donnée partagée : protège-la.",
    ],
    code: [{ titre: "Programme de test (Java)", texte:
`public class TestCoureur {
    public static void main(String[] args) {
        System.out.println("Passage aux : ");
        Coureur j = new Coureur("Jean");
        Coureur p = new Coureur("Paul");
        j.start();
        p.start();
        try {
            j.join();   // attendre la fin de Jean
            p.join();   // et de Paul avant de lancer Toto
        } catch (InterruptedException e) { }
        Coureur k = new Coureur("Toto");
        k.start();
    }
}` }],
    sortie: "Passage aux :\n100 m par Jean\n100 m par Paul\n200 m par Paul\n300 m par Paul\n200 m par Jean\n...\n1000 m par Jean\n...\n1000 m par Paul\n100 m par Toto\n...",
    langs: {
      java: ["`class Coureur extends Thread` ; redéfinis `run()` ; pause : `Thread.sleep((long) (Math.random() * 1000))`."],
      python: ["`class Coureur(threading.Thread)` ; redéfinis `run()` ; pause : `time.sleep(random.random())`."],
      c: ["`pthread_create(&t, NULL, courir, nom)` ; `rand()` n'est pas sûr entre threads : utilise `rand_r` avec une graine par coureur. Pause : `usleep`."],
      cpp: ["`std::thread t(courir, \"Jean\");` ; pause : `std::this_thread::sleep_for(std::chrono::milliseconds(...))` ; un générateur `std::mt19937` par thread."],
      go: ["Une goroutine par coureur ; `sync.WaitGroup` pour attendre Jean et Paul ; pause : `time.Sleep(time.Duration(rand.IntN(1000)) * time.Millisecond)`.", "Attention : `main` qui se termine tue Toto ; attends-le aussi."],
      rust: ["`thread::spawn(move || ...)` renvoie un `JoinHandle` ; `.join().unwrap()`.", "Aléatoire : crate `rand`, ou des pauses dérivées de `SystemTime` (voir l'exercice 24)."],
    },
  },
  {
    id: "53", partie: "p9", titre: "Course de 1000 m, second style",
    notions: ["styles de création de threads"],
    enonce: [
      "Reprendre l'exercice 52 avec l'**autre** façon de créer un thread dans ton langage (voir ci-dessous). Le cahier d'origine indiquait par erreur « l'exercice 1 ».",
      "Puis compare : quelle approche est la plus souple ? Laquelle permet à `Coureur` d'hériter d'autre chose ou d'être réutilisé ?",
    ],
    langs: {
      java: ["Implémente l'interface `Runnable` : `new Thread(new Coureur(\"Jean\")).start()`."],
      python: ["Au lieu d'hériter de `Thread` : `threading.Thread(target=courir, args=(\"Jean\",))`."],
      c: ["En C, il n'y a qu'un seul style (`pthread_create` + fonction). Variante : passe au thread une **struct** d'arguments (nom + classement partagé + mutex) au lieu d'une simple chaîne."],
      cpp: ["Version 1 : une classe-fonction (foncteur avec `operator()`). Version 2 : une lambda. Bonus : `std::jthread` (C++20)."],
      go: ["Version 1 : méthode `func (c *Coureur) Courir(wg *sync.WaitGroup)`. Version 2 : closure anonyme `go func() { ... }()`. Bonus : remplace le `WaitGroup` par un channel d'arrivée."],
      rust: ["Version 1 : closure `move`. Version 2 : une struct `Coureur` avec une méthode `courir(self)` envoyée dans `thread::spawn(move || c.courir())`. Bonus : `thread::scope` pour emprunter sans `move`."],
    },
  },
  {
    id: "54", partie: "p9", titre: "Trier puis afficher : deux threads coordonnés",
    notions: ["coordination", "attente d'un événement"],
    enonce: [
      "Écrire un type `Trieur` :",
      "- `triTableau(t)` : renvoie le tableau trié par ordre croissant ;",
      "- `echanger(t, i, j)` : échange deux cases (utilisé par le tri) ;",
      "- `affiche()` : affiche le tableau trié.",
      "Créer deux threads : `ThreadTrieTableau` lance le tri, `ThreadAfficheTableau` lance l'affichage.",
      "Identifie le problème d'accès concurrent (que se passe-t-il si l'affichage démarre avant ou pendant le tri ?) et fais en sorte qu'il ne puisse **jamais** se produire.",
      "Le programme de test `TestTrieur` fait saisir le tableau au clavier, puis lance les deux threads.",
      "Réaliser **deux versions** avec les deux styles de création de threads de ton langage (voir l'exercice 53).",
    ],
    langs: {
      java: ["Version 1 : `extends Thread`, version 2 : `implements Runnable`. Coordination : `wait()`/`notifyAll()` sur un indicateur « trié », ou `CountDownLatch`."],
      python: ["Coordination : `threading.Event` (`set()` après le tri, `wait()` avant l'affichage) ; version 2 avec `threading.Condition`."],
      c: ["`pthread_cond_t` + `pthread_mutex_t` + un booléen `trie` ; l'afficheur attend avec `while (!trie) pthread_cond_wait(...)`. Explique pourquoi un `while` et pas un `if`."],
      cpp: ["`std::condition_variable` + `std::mutex` + booléen ; version 2 : `std::promise<void>` / `std::future<void>`."],
      go: ["Un channel `fait := make(chan struct{})` fermé par le trieur ; l'afficheur fait `<-fait`. Version 2 : le trieur **envoie** le tableau trié dans un channel."],
      rust: ["Version 1 : `Arc<(Mutex<bool>, Condvar)>`. Version 2 : `std::sync::mpsc::channel` qui transmet le `Vec` trié (le transfert de propriété supprime le partage)."],
    },
  },

  // ───────────────────────── Fichiers & interfaces ─────────────────────────
  {
    id: "es", num: "Projet", partie: "p10", titre: "Gestion de comptes avec sauvegarde sur disque",
    notions: ["projet", "fichiers", "interface", "threads"],
    enonce: [
      "Créer et manipuler des comptes bancaires, en sauvegardant toutes les transactions dans des fichiers. Toutes les erreurs possibles (fichier absent, saisie invalide...) doivent être gérées. Le dossier de travail est `gestioncompte/`.",
      "### Étape 1 : l'interface utilisateur",
      "Réaliser l'interface dans un module `frame.compte`. Elle comporte :",
      "- des champs : Prénom, Nom, Numéro de compte, Solde, Découvert, Montant ;",
      "- des boutons : Créer compte, Historique du compte, Dépôt, Retrait, Quitter ;",
      "- une zone de texte multiligne pour les affichages.",
      "### Étape 2 : les comptes",
      "Dans un module `gestion.transaction`, un type `Compte` avec au minimum : un constructeur, `getNom()`, `getPrenom()`, `getSolde()`, `getDecouvert()`, `getNumeroCompte()`, `getHistorique()`, `crediter(montant)`, `debiter(montant)`, `setDecouvert(montant)`.",
      "### Étape 3 : transactions synchronisées",
      "Le compte est une ressource critique : un dépôt et un retrait ne doivent jamais s'exécuter en même temps. Dans un module `gestion.synchro`, créer deux threads `ThreadCompteRetrait` et `ThreadCompteDepot` qui gèrent l'exclusion mutuelle.",
      "### Étape 4 : événements et fichiers",
      "- **Créer compte** crée le compte et l'enregistre dans un fichier texte `gestioncompte/clients/<numéro>.txt`. Aucun champ ne doit être vide ; prénom et nom n'acceptent que des lettres ; solde et découvert n'acceptent que des chiffres ; le numéro de compte fait exactement 10 chiffres. Succès ou échec sont signalés à l'utilisateur.",
      "- **Historique du compte** : à partir du numéro saisi, affiche toutes les informations du client dans la zone de texte.",
      "- **Dépôt** et **Retrait** : à partir du numéro saisi, modifient le solde (opérations synchronisées). Les montants invalides sont refusés. Le fichier du client est réécrit après chaque opération.",
      "### Finitions",
      "- Gérer proprement la fermeture de l'application.",
      "- Valider le montant avec la touche Entrée doit être possible.",
      "- La logique métier (`gestion.transaction`, `gestion.synchro`) est empaquetée séparément puis utilisée par l'interface.",
    ],
    langs: {
      java: ["Swing ; filtrer la frappe : `KeyListener` (consommer l'événement) ou mieux `DocumentFilter`.", "Boîtes modales : `JOptionPane.showMessageDialog`.", "Empaquetage : deux `.jar` ajoutés au projet de l'interface comme bibliothèques."],
      python: ["`tkinter` ; filtrer la frappe : `Entry(validate=\"key\", validatecommand=...)`.", "Boîtes modales : `tkinter.messagebox`. Touche Entrée : `widget.bind(\"<Return>\", ...)`.", "Empaquetage : paquets `gestion/transaction` et `gestion/synchro` importés par l'interface."],
      c: ["Interface : menu console (1. Créer, 2. Historique, 3. Dépôt, 4. Retrait, 0. Quitter). Les filtres de frappe deviennent des validations avec redemande.", "Dossiers : `mkdir` (`<sys/stat.h>`, ou `_mkdir` sous Windows).", "Empaquetage : `libtransaction.a` et `libsynchro.a` liées au programme principal."],
      cpp: ["Interface : menu console (bonus : Qt).", "Fichiers : `std::filesystem::create_directories`, `std::ofstream`.", "Empaquetage : bibliothèques statiques, compilées avec CMake."],
      go: ["Interface : menu console, ou bonus : une page web locale (`net/http`, formulaire HTML) qui appelle les mêmes fonctions.", "Organisation : packages `gestion/transaction` et `gestion/synchro` dans un module Go."],
      rust: ["Interface : menu console (bonus : `egui`).", "Organisation : un workspace Cargo avec un crate `gestion` (bibliothèque) et un crate `app` (binaire).", "Erreurs de fichiers : `std::io::Result` propagées avec `?`."],
    },
  },
  {
    id: "f1", num: "F1", partie: "p10", titre: "Gestion des notes d'étudiants",
    notions: ["fichiers", "interface"],
    enonce: [
      "Sauvegarder les notes de chaque étudiant d'une promotion dans un fichier texte nommé d'après son **numéro de carte**, dans le dossier `notes/`.",
      "Dans un type `GestionNotes` :",
      "- `saveStudentsMarks(numCarte, notes)` : enregistre un tableau de notes dans le fichier de l'étudiant et renvoie le fichier créé ;",
      "- `saisirNotes()` : fait saisir les notes d'un étudiant et les renvoie dans un tableau ;",
      "- `showMarks(numCarte)` : relit le fichier et affiche les notes de l'étudiant.",
      "Créer une interface `InterfaceGestion` pour saisir les notes, les enregistrer, puis relire celles d'un étudiant donné.",
      "Bonus : afficher aussi la moyenne, et refuser les notes hors de [0, 20].",
    ],
    langs: {
      java: ["Saisie : `JOptionPane.showInputDialog` ; affichage dans un `JTextArea`."],
      python: ["`tkinter` (ou `simpledialog.askfloat` pour la saisie)."],
      c: ["Menu console ; `fprintf` une note par ligne, relecture avec `fscanf` en testant le retour."],
      cpp: ["Menu console ; `std::ofstream` / `std::ifstream`."],
      go: ["Menu console ; `os.WriteFile` + `strings.Split` à la relecture."],
      rust: ["Menu console ; `fs::write` et `fs::read_to_string` + `lines()` + `parse::<f64>()`."],
    },
  },
  {
    id: "f2", num: "F2", partie: "p10", titre: "Lire un fichier texte",
    notions: ["lecture de fichiers", "explorateur"],
    enonce: [
      "Créer un type `Lecture` qui permet de choisir un fichier texte n'importe où sur le disque et d'afficher son contenu dans une zone de texte multiligne.",
      "Gérer les erreurs : fichier introuvable, droits insuffisants, fichier non textuel.",
    ],
    langs: {
      java: ["`JFileChooser` + `JTextArea` dans un `JScrollPane`."],
      python: ["`tkinter.filedialog.askopenfilename` + widget `Text`."],
      c: ["Version console : lister le dossier courant (`opendir`/`readdir`), faire choisir un fichier, l'afficher ligne par ligne."],
      cpp: ["Version console : `std::filesystem::directory_iterator` pour lister, puis lecture avec `std::getline`."],
      go: ["Version console : `os.ReadDir` pour lister ; bonus : servir le contenu dans une page web locale."],
      rust: ["Version console : `fs::read_dir` pour lister, `fs::read_to_string` pour lire ; un fichier non UTF-8 renvoie une erreur à traiter."],
    },
  },
  {
    id: "f3", num: "F3", partie: "p10", titre: "Écrire dans un fichier texte",
    notions: ["écriture de fichiers"],
    enonce: [
      "Créer un type `Ecriture` qui enregistre ce que l'utilisateur tape dans une zone de texte multiligne, soit dans un fichier existant (choisi n'importe où), soit dans un nouveau fichier.",
      "La sauvegarde se déclenche avec un bouton « Enregistrer » ou un raccourci clavier.",
      "Bonus : demander confirmation avant d'écraser un fichier existant, et proposer « ajouter à la fin ».",
    ],
    langs: {
      java: ["`JFileChooser.showSaveDialog` + `Files.writeString`."],
      python: ["`filedialog.asksaveasfilename` + `Text.get(\"1.0\", \"end\")`."],
      c: ["Version console : lire des lignes jusqu'à une ligne `.fin`, puis écrire (`\"w\"` pour écraser, `\"a\"` pour ajouter)."],
      cpp: ["Version console : `std::getline` jusqu'à `.fin` ; `std::ios::app` pour ajouter."],
      go: ["Version console : `bufio.Scanner` jusqu'à `.fin` ; `os.OpenFile` avec `os.O_APPEND` pour ajouter."],
      rust: ["Version console : lignes de `stdin().lines()` jusqu'à `.fin` ; `OpenOptions::new().append(true)` pour ajouter."],
    },
  },

  // ───────────────────────── Collections & BD ─────────────────────────
  {
    id: "c1", num: "C1", partie: "p11", titre: "Comptes en mémoire avec une table associative",
    notions: ["table associative", "synchronisation", "interface"],
    enonce: [
      "Créer un type `Compte` : numéro, nom et prénom du titulaire, solde initial, découvert autorisé. Avec les méthodes de service utiles, dont :",
      "- `retirer(montant)` : retire le montant et renvoie le solde après l'opération ;",
      "- `deposer(montant)` : dépose le montant et renvoie le solde après l'opération.",
      "**Important :** le type dispose d'une table associative **partagée** (attribut de classe) où chaque compte créé est enregistré, indexé par son numéro. C'est par elle qu'on retrouve un compte pour y faire une opération. Dépôts et retraits sont synchronisés.",
      "Créer ensuite l'application `BankClients` qui gère les comptes clients :",
      "- un constructeur `BankClients(num, prenom, nom, solde, decouvert)` qui s'appuie sur celui de `Compte` ;",
      "- `deposer(num, montant)` et `retirer(num, montant)`, qui s'appuient sur ceux de `Compte`.",
      "Interface : bouton **Valider** (création d'un compte), **Afficher** (infos d'un compte dans la zone de texte, à partir du numéro), **Dépôt/Retrait** (numéro + montant).",
    ],
  },
  {
    id: "c2", num: "C2", partie: "p11", titre: "Persistance des comptes en base de données",
    notions: ["SQL", "persistance", "affichage tabulaire"],
    enonce: [
      "Reprendre C1 et sauvegarder tous les comptes dans une base de données (SQLite pour commencer, MySQL ensuite si tu veux).",
      "Au démarrage, charger tous les comptes depuis la base et les afficher dans un **tableau** (grille) ajouté à l'interface.",
      "Chaque dépôt ou retrait met la base à jour dans une **transaction**.",
    ],
    langs: {
      java: ["JDBC + `JTable` alimenté par un `DefaultTableModel`."],
      python: ["`sqlite3` + `ttk.Treeview` pour la grille."],
      c: ["`sqlite3` ; la « grille » est un tableau aligné en console (`printf(\"%-10s ...\")`)."],
      cpp: ["SQLite ; affichage en colonnes avec `std::setw`."],
      go: ["`database/sql` ; affichage avec `text/tabwriter`, ou un tableau HTML si tu as fait l'interface web."],
      rust: ["`rusqlite` ; transaction avec `conn.transaction()?` ; affichage en colonnes avec `{:<10}`."],
    },
  },
  {
    id: "bd1", num: "BD1", partie: "p11", titre: "Application RH avec authentification",
    notions: ["authentification", "CRUD", "SQL"],
    enonce: [
      "Créer une application connectée à une base de données, qui exécute des requêtes de sélection et de mise à jour.",
      "### Authentification",
      "- Le bouton **Entrée** est désactivé tant que l'utilisateur n'a pas commencé à taper son mot de passe. Il donne accès à l'application si le login et le mot de passe sont corrects (vérifiés dans une table de la base) ; sinon, un message refuse l'accès.",
      "- Le bouton **Annuler** efface le login et le mot de passe saisis.",
      "- La case **Changer le mot de passe** ouvre un écran pour modifier le mot de passe de l'utilisateur (validation avec confirmation, ou annulation pour revenir à l'écran précédent).",
      "### Application",
      "- **InfosBase** remplit une grille avec les enregistrements de la table `Employes`.",
      "- **EnregBase** enregistre un nouvel employé ; aucun champ vide n'est accepté.",
      "- Sélectionner une ligne de la grille ouvre une fenêtre qui permet de supprimer cet employé ou d'annuler.",
      "### Base de données",
      "- `Employes(Prenom, Nom, Sexe, Date_Nais, NumMle, Date_Embauche)` ;",
      "- une table des utilisateurs autorisés (secrétaire, DRH).",
      "### Sécurité (non négociable)",
      "- Requêtes **paramétrées** uniquement : jamais de concaténation de saisie utilisateur dans du SQL.",
      "- Les mots de passe sont stockés **hachés** (bcrypt, Argon2 ou au minimum un hachage salé), jamais en clair.",
    ],
    langs: {
      java: ["Swing + JDBC (`PreparedStatement`) ; activer le bouton : `DocumentListener` sur le `JPasswordField`.", "Hachage : bibliothèque jBCrypt."],
      python: ["`tkinter` + `sqlite3` ; activer le bouton : `trace_add` sur la `StringVar` du mot de passe.", "Hachage : `hashlib.scrypt` (intégré) ou `bcrypt`."],
      c: ["Console + `sqlite3` ; saisie du mot de passe sans écho : `termios` (Unix) ou `_getch` (Windows).", "Hachage : libsodium (`crypto_pwhash`)."],
      cpp: ["Console (ou Qt) + SQLite ; hachage : libsodium."],
      go: ["Console ou web (`net/http`) + `database/sql` ; hachage : `golang.org/x/crypto/bcrypt` ; saisie masquée : `golang.org/x/term`."],
      rust: ["Console + `rusqlite` ; hachage : crate `argon2` ; saisie masquée : crate `rpassword`."],
    },
  },
  {
    id: "bd2", num: "BD2", partie: "p11", titre: "Banque connectée à une base de données",
    notions: ["SQL", "transactions", "synthèse"],
    enonce: [
      "Exercice de synthèse : la même interface que C1, mais connectée à une base de données contenant une table `clients(Numero, prenom, nom, solde)`.",
      "Un type `Compte` avec au minimum : un constructeur, `deposer`, `retirer`, un accesseur par champ et une méthode d'affichage.",
      "- **Valider** : enregistre un nouveau client dans la table.",
      "- **Dépôt/Retrait** : à partir du numéro et du montant, effectue l'opération directement en base.",
      "- **Afficher** : à partir du numéro, affiche les détails du compte dans la zone « Informations client ».",
      "Le retrait doit refuser de passer sous zéro, idéalement par une seule requête conditionnelle (`UPDATE ... WHERE solde >= ?`) dont on vérifie le nombre de lignes modifiées.",
    ],
  },
];
