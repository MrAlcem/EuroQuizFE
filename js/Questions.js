class Question {
    constructor(number, text, category, nation, options = {}, correct = {}) {
        this.number = number;
        this.text = text;
        this.category = category;
        this.nation = nation;
        this.options = options;
        this.correct = correct;
    }

    createRow() {
        let categoryClass = "";
        if (this.category == "Geography") { categoryClass = "geo" }
        else if (this.category == "Nature") { categoryClass = "nat" }
        else if (this.category == "History") { categoryClass = "hist" }
        else if (this.category == "Culture") { categoryClass = "cult" }

        const $row = $(`
            <tr>
                <td>${this.number}</td>
                <td>${this.text}</td>
                <td><span class="tag ${categoryClass}">${this.category}</span></td>
                <td><span class="flag">${this.nation}</span></td>
                <td class="actions">
                    <i class="fa-regular fa-pen-to-square edit-btn" title="Edit"></i>
                    <i class="fa-regular fa-trash-can delete-btn" title="Delete"></i>
                </td>
            </tr>
        `);

        $row.data("question", this);
        return $row;
    }
}

$(document).ready(function () {

    const $qText = $("#question-text");
    const $qNation = $("#question-nation");
    const $qCategory = $("#question-category");

    const $optA = $("#opt-a");
    const $optB = $("#opt-b");
    const $optC = $("#opt-c");
    const $optD = $("#opt-d");

    const $ansA = $("#ans-a");
    const $ansB = $("#ans-b");
    const $ansC = $("#ans-c");
    const $ansD = $("#ans-d");

    const $addBtn = $(".btn");

    let questionCounter = 0;

    $addBtn.on("click", function (e) {
        e.preventDefault();

        const text = $qText.val().trim();
        const nation = $qNation.val();
        const category = $qCategory.val();

        const options = {
            a: $optA.val().trim(),
            b: $optB.val().trim(),
            c: $optC.val().trim(),
            d: $optD.val().trim()
        };

        const correct = {
            a: $ansA.is(":checked"),
            b: $ansB.is(":checked"),
            c: $ansC.is(":checked"),
            d: $ansD.is(":checked")
        };

        // Validation
        if (!text) {
            alert("Please enter the question text.");
            $qText.focus();
            return;
        }

        if (!Object.values(correct).some(v => v)) {
            alert("Please select at least one correct answer.");
            return;
        }

        questionCounter++;

        const q = new Question(
            questionCounter,
            text,
            category,
            nation,
            options,
            correct
        );

        // Append to the table body
        $("#questions-table tbody").append(q.createRow());
        clearForm();
    });

    function clearForm() {
        $qText.val("");
        $optA.val(""); $optB.val(""); $optC.val(""); $optD.val("");
        $ansA.prop("checked", false);
        $ansB.prop("checked", false);
        $ansC.prop("checked", false);
        $ansD.prop("checked", false);
    }

});