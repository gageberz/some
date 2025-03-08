/*
1st attempt: Simulated time intervals where each iteration of the outer while loop represents a 30-minute interval.
Issues:
    O(n^2) Time Complexity:
    The time depends solely on the sorted position of name and the number of judges. Each batch of num_of_judges people takes 30 minutes.
*/
function courtOriginal(name, num_of_judges, other_people) {
    let time_to_seen = 0;
    let judges_free = num_of_judges;
    const everyone = other_people.split(" ");
    everyone.push(name);
    everyone.sort();
    while (true) {
        time_to_seen += 30;
        while (judges_free > 0) {
            const person = everyone.shift();
            if (person === name) {
                return time_to_seen;
            }
            judges_free--;
        }
        judges_free = num_of_judges;
    }
}

/*
2nd attempt: Replace the simulation by directly using the index.
    O(n*log(n)) time complexity.
    Avoids shifting
We can go faster by not sorting it
*/
function courtOptimized(name, num_of_judges, other_people) {
    const everyone = other_people.split(" ");
    everyone.push(name);
    everyone.sort();
    const index = everyone.indexOf(name);

    return (Math.floor(index / num_of_judges) + 1) * 30;
}

/*
3rd attempt: Removed sorting, just calculate the would be position without sorting.
If there are other people with the same name (me? us? our? :3 ), we have them go first.
*/
function courtVeryOptimized(name, num_of_judges, other_people) {
    const others = other_people.split(" ");
    let index = 0;
    for (const person of others) {
        if (person <= name) index++;
    }

    return (Math.floor(index / num_of_judges) + 1) * 30;
}

const testCases = [
    { size: 5, label: "5 people" },
    { size: 1000, label: "1,000 people" },
    { size: 50000, label: "50,000 people" },
];

function generateRandomWord() {
    const length = Math.floor(Math.random() * 11) + 1;
    let word = "";
    for (let i = 0; i < length; i++) {
      const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      word += randomChar;
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateTestData(size) {
  const otherPeople = Array.from({ length: size - 1 }, () => generateRandomWord());
  return otherPeople.join(" ");
}

function runBenchmark() {
    btn.disabled = true;
    resultsContainer.textContent = "Running benchmarks, this could take a few seconds ...";

    const algorithms = [
        { name: "Original", func: courtOriginal },
        { name: "Optimized", func: courtOptimized },
        { name: "Very Optimized", func: courtVeryOptimized },
    ];
    
    let intermediate = "";
    setTimeout(() => {
        testCases.forEach(testCase => {
            const other_people = generateTestData(testCase.size);
            const name = "Klondike";
            const judges = 3;
            const runs = 10;
            const expected = courtVeryOptimized(name, judges, other_people);

            let output = `${testCase.label}:\n`;

            algorithms.forEach(algorithm => {
                let totalTime = 0;
                
                for (let i = 0; i < runs; i++) {
                    const start = performance.now();
                    const result = algorithm.func(name, judges, other_people);
                    const end = performance.now();
                    console.assert(result === expected, `${algorithm.name} implementation failed`);
                    totalTime += (end - start);
                }
                const averageTime = totalTime / runs;
                output += `  ${algorithm.name}: ${averageTime.toFixed(3)} ms\n`;
            });
            output += "\n";
            intermediate += output;
        });
        resultsContainer.textContent = intermediate;
        btn.disabled = false;
    }, 100);
}

const btn = document.querySelector("#runBenchmarkButton");
const resultsContainer = document.querySelector("#results");
btn.addEventListener("click", runBenchmark);