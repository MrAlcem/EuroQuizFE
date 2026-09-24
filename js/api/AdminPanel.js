// ==============================
// ADMIN PANEL → /admin/questions, /admin/users
// ==============================

$(document).ready(function () {
    var questions = [];
    var users = [];
    var QUESTION_LANGUAGES = ["en", "hr", "se", "nl"];
    var TRANSLATABLE_FIELDS = ["question-text", "opt-a", "opt-b", "opt-c", "opt-d"];

    function escapeHtml(str) {
        return $("<div>").text(str == null ? "" : str).html();
    }

    function setQuestionLang(lang) {
        $("#question-lang-tabs .lang-tab").each(function () {
            $(this).toggleClass("active", $(this).data("lang") === lang);
        });
        $(".lang-field").each(function () {
            $(this).prop("hidden", $(this).data("lang") !== lang);
        });
    }

    function fillLangField(baseId, translations) {
        translations = translations || {};
        QUESTION_LANGUAGES.forEach(function (lang) {
            $("#" + baseId + "-" + lang).val(translations[lang] || "");
        });
    }

    function collectLangField(baseId) {
        var value = {};
        QUESTION_LANGUAGES.forEach(function (lang) {
            var text = $("#" + baseId + "-" + lang).val().trim();
            if (text) value[lang] = text;
        });
        return value;
    }

    $("#question-lang-tabs .lang-tab").on("click", function () {
        setQuestionLang($(this).data("lang"));
    });

    function previewText(translations) {
        if (!translations) return "";
        return translations.en || Object.values(translations)[0] || "";
    }

    function categoryClass(category) {
        switch (category) {
            case "Geography": return "geo";
            case "Nature": return "nat";
            case "History": return "hist";
            case "Culture": return "cult";
            default: return "";
        }
    }

    function showFormError(message) {
        $("#question-form-error").text(message).show();
    }

    function clearFormError() {
        $("#question-form-error").hide().text("");
    }

    function clearForm() {
        $("#edit-question-id").val("");
        $(".lang-field").val("");
        $("#question-time-limit").val("");
        $("input[name='correct-option']").prop("checked", false);
        $("#question-nation").val("NL");
        $("#question-category").val("Geography");
        $("#question-difficulty").val("easy");
        $("#question-form-title").text("Add New Question");
        $("#submit-question-btn").text("Add Question Entry");
        $("#cancel-edit-btn").hide();
        setQuestionLang("en");
        clearFormError();
    }

    function renderQuestionsTable() {
        var $body = $("#questions-table-body");
        $body.empty();

        questions.forEach(function (q) {
            var $row = $("<tr>");
            $row.append($("<td>").text("#" + q.id));
            $row.append($("<td>").text(previewText(q.question_text)));
            $row.append($("<td>").append(
                $("<span>").addClass("tag").addClass(categoryClass(q.category)).text(q.category)
            ));
            $row.append($("<td>").text(q.country));
            $row.append($("<td>").text(q.difficulty));

            var $actions = $("<td>").addClass("actions");
            $actions.append(
                $("<i>").addClass("fa-regular fa-pen-to-square edit-btn").attr("title", "Edit")
                    .on("click", function () { startEdit(q.id); })
            );
            $actions.append(
                $("<i>").addClass("fa-regular fa-trash-can delete-btn").attr("title", "Delete")
                    .on("click", function () { deleteQuestion(q.id); })
            );
            $row.append($actions);

            $body.append($row);
        });

        if (questions.length === 0) {
            $body.append('<tr><td colspan="6">No questions yet.</td></tr>');
        }

        $("#stat-total-questions").text(questions.length);

        var categories = {};
        questions.forEach(function (q) { categories[q.category] = true; });
        $("#stat-total-categories").text(Object.keys(categories).length);

        var hrCount = questions.filter(function (q) { return q.country === "HR"; }).length;
        var nlCount = questions.filter(function (q) { return q.country === "NL"; }).length;
        var total = questions.length;

        $("#distribution-total").text(total);
        $("#distribution-hr").text(hrCount + " Qs");
        $("#distribution-nl").text(nlCount + " Qs");

        if (total > 0) {
            var hrPct = (hrCount / total) * 100;
            $("#distribution-donut").css(
                "background",
                "conic-gradient(#3b82f6 0% " + hrPct + "%, #10b981 " + hrPct + "% 100%)"
            );
        }
    }

    function renderUsersTable() {
        var $body = $("#users-table-body");
        $body.empty();

        users.forEach(function (u) {
            var $row = $("<tr>");
            $row.append($("<td>").text("#" + u.id));
            $row.append($("<td>").text(u.name));
            $row.append($("<td>").text(u.email));
            $row.append($("<td>").text(u.level));
            $row.append($("<td>").text(u.total_score + " pts"));
            $row.append($("<td>").text(u.joined_at));
            $body.append($row);
        });

        if (users.length === 0) {
            $body.append('<tr><td colspan="6">No users yet.</td></tr>');
        }

        $("#stat-total-users").text(users.length);
        var totalResults = users.reduce(function (sum, u) { return sum + (u.quizzes_played || 0); }, 0);
        $("#stat-total-results").text(totalResults);
    }

    async function loadQuestions() {
        try {
            var res = await authFetch(API_BASE + "/admin/questions", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load questions");
            questions = body.data;
            renderQuestionsTable();
        } catch (err) {
            $("#questions-table-body").html('<tr><td colspan="6">' + escapeHtml(err.message) + "</td></tr>");
        }
    }

    async function loadUsers() {
        try {
            var res = await authFetch(API_BASE + "/admin/users", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load users");
            users = body.data;
            renderUsersTable();
        } catch (err) {
            $("#users-table-body").html('<tr><td colspan="6">' + escapeHtml(err.message) + "</td></tr>");
        }
    }

    function startEdit(id) {
        var q = questions.find(function (item) { return item.id === id; });
        if (!q) return;

        $("#edit-question-id").val(q.id);
        fillLangField("question-text", q.question_text);
        fillLangField("opt-a", q.option_a);
        fillLangField("opt-b", q.option_b);
        fillLangField("opt-c", q.option_c);
        fillLangField("opt-d", q.option_d);
        $("#question-nation").val(q.country);
        $("#question-category").val(q.category);
        $("#question-difficulty").val(q.difficulty);
        $("#question-time-limit").val(q.time_limit_seconds);
        $("input[name='correct-option']").prop("checked", false);
        $("#ans-" + q.correct_option.toLowerCase()).prop("checked", true);

        $("#question-form-title").text("Edit Question #" + q.id);
        $("#submit-question-btn").text("Update Question");
        $("#cancel-edit-btn").show();
        setQuestionLang("en");
        clearFormError();
        window.scrollTo(0, 0);
    }

    async function deleteQuestion(id) {
        if (!window.confirm("Delete this question? This cannot be undone.")) return;

        try {
            var res = await authFetch(API_BASE + "/admin/questions/" + id, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                var body = await res.json().catch(function () { return {}; });
                throw new Error(body.message || "Failed to delete question");
            }
            questions = questions.filter(function (q) { return q.id !== id; });
            renderQuestionsTable();
        } catch (err) {
            window.alert(err.message);
        }
    }

    $("#cancel-edit-btn").on("click", function (e) {
        e.preventDefault();
        clearForm();
    });

    $("#submit-question-btn").on("click", async function (e) {
        e.preventDefault();
        clearFormError();

        var editId = $("#edit-question-id").val();
        var payload = {
            question_text: collectLangField("question-text"),
            option_a: collectLangField("opt-a"),
            option_b: collectLangField("opt-b"),
            option_c: collectLangField("opt-c"),
            option_d: collectLangField("opt-d"),
            correct_option: $("input[name='correct-option']:checked").val(),
            category: $("#question-category").val(),
            country: $("#question-nation").val(),
            difficulty: $("#question-difficulty").val()
        };

        var timeLimit = $("#question-time-limit").val();
        if (timeLimit) payload.time_limit_seconds = parseInt(timeLimit, 10);

        var missingEnglish = TRANSLATABLE_FIELDS.some(function (baseId) {
            return !$("#" + baseId + "-en").val().trim();
        });
        if (missingEnglish) {
            showFormError("Please fill in the English question text and all four English options.");
            return;
        }
        if (!payload.correct_option) {
            showFormError("Please select the correct option.");
            return;
        }

        try {
            var url = API_BASE + "/admin/questions" + (editId ? "/" + editId : "");
            var res = await authFetch(url, {
                method: editId ? "PUT" : "POST",
                body: JSON.stringify(payload)
            });
            var body = await res.json();

            if (!res.ok) {
                var firstError = body.errors && Object.values(body.errors)[0];
                throw new Error((firstError && firstError[0]) || body.message || "Failed to save question");
            }

            clearForm();
            await loadQuestions();
        } catch (err) {
            showFormError(err.message);
        }
    });

    clearForm();
    loadQuestions();
    loadUsers();
});
