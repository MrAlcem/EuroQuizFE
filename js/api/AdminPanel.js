// ==============================
// ADMIN PANEL → /admin/questions, /admin/users
// ==============================

$(document).ready(function () {
    var questions = [];
    var users = [];
    var QUESTION_LANGUAGES = ["en", "hr", "se", "nl"];
    var TRANSLATABLE_FIELDS = ["question-text", "opt-a", "opt-b", "opt-c", "opt-d"];
    var results = [];
    var categories = [];
    var countries = [];
    var settings = {};
    var questionPagination = {
        page: 1,
        perPage: 10,
        total: 0,
        lastPage: 1
    };
    var feedbackTimeout;
    var availableSections = ["dashboard", "questions", "add-question", "users", "results", "categories", "settings"];

    function showSection(section) {
        if (availableSections.indexOf(section) === -1) {
            section = "dashboard";
        }

        $(".admin-section").each(function () {
            $(this).toggle($(this).data("admin-section") === section);
        });

        $(".admin-section-placeholder").each(function () {
            var isActive = $(this).data("admin-section") === section;
            $(this).prop("hidden", !isActive);
        });

        $(".nav-item[data-admin-section]").each(function () {
            $(this).toggleClass("active", $(this).data("admin-section") === section);
        });

        if (window.location.hash !== "#" + section) {
            window.history.replaceState(null, "", "#" + section);
        }
    }

    $(".nav-item[data-admin-section], a[data-admin-section]").on("click", function (event) {
        event.preventDefault();
        showSection($(this).data("admin-section"));
    });

    window.addEventListener("hashchange", function () {
        showSection(window.location.hash.substring(1) || "dashboard");
    });

    showSection(window.location.hash.substring(1) || "dashboard");

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

    function showAdminFeedback(message, type) {
        var $feedback = $("#admin-feedback");
        window.clearTimeout(feedbackTimeout);
        $feedback
            .removeClass("is-success is-error is-loading")
            .addClass("is-" + type)
            .attr("aria-live", type === "error" ? "assertive" : "polite")
            .text(message)
            .prop("hidden", false);

        if (type !== "loading") {
            feedbackTimeout = window.setTimeout(function () {
                $feedback.prop("hidden", true).text("");
            }, 5000);
        }
    }

    function setButtonPending($button, isPending, pendingLabel) {
        if (isPending) {
            if ($button.data("idle-label") === undefined) {
                $button.data("idle-label", $button.text());
            }
            $button.prop("disabled", true).attr("aria-busy", "true").text(pendingLabel);
            return;
        }

        $button.prop("disabled", false).removeAttr("aria-busy").text($button.data("idle-label"));
        $button.removeData("idle-label");
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
        showAdminFeedback(message, "error");
    }

    function clearFormError() {
        $("#question-form-error").hide().text("");
    }

    function clearForm() {
        $("#edit-question-id").val("");
        $(".lang-field").val("");
        $("#question-time-limit").val("");
        $("input[name='correct-option']").prop("checked", false);
        $("#question-nation").val(countries.indexOf("NL") !== -1 ? "NL" : (countries[0] || ""));
        if (categories.length > 0) {
            $("#question-category").val(categories[0].name);
        }
        $("#question-difficulty").val("easy");
        $("#question-form-title").text("Add New Question");
        $("#submit-question-btn").text("Add Question Entry");
        $("#cancel-edit-btn").hide();
        setQuestionLang("en");
        clearFormError();
    }

    function renderCategoryOptions(selectedName) {
        var $select = $("#question-category");
        $select.empty();
        categories.forEach(function (category) {
            $("<option>").val(category.name).text(category.name).appendTo($select);
        });
        if (selectedName) {
            $select.val(selectedName);
        }
    }

    function renderQuestionFilterCategories() {
        var $select = $("#questions-category-filter");
        var selected = $select.val();
        $select.find("option:not(:first)").remove();
        categories.forEach(function (category) {
            $("<option>").val(category.name).text(category.name).appendTo($select);
        });
        $select.val(selected);
    }

    function countryLabel(countryCode) {
        var knownNames = { HR: "Croatia", NL: "Netherlands" };
        return knownNames[countryCode] ? knownNames[countryCode] + " (" + countryCode + ")" : countryCode;
    }

    function renderCountryOptions(selectedCountry) {
        var $input = $("#question-nation");
        var $datalist = $("#question-country-options");
        var $filter = $("#questions-country-filter");
        var currentCountry = selectedCountry === undefined ? $input.val() : selectedCountry;
        var selectedFilter = $filter.val();

        $datalist.empty();
        $filter.find("option:not(:first)").remove();
        countries.forEach(function (countryCode) {
            $("<option>").val(countryCode).attr("label", countryLabel(countryCode)).appendTo($datalist);
            $("<option>").val(countryCode).text(countryLabel(countryCode)).appendTo($filter);
        });

        $input.val(currentCountry || (countries.indexOf("NL") !== -1 ? "NL" : (countries[0] || "")));
        $filter.val(countries.indexOf(selectedFilter) !== -1 ? selectedFilter : "");
    }

    async function loadQuestionOptions() {
        try {
            var res = await authFetch(API_BASE + "/admin/questions/options", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load question options");
            countries = body.data.countries;
            renderCountryOptions();
        } catch (err) {
            showAdminFeedback("Country options could not be loaded: " + err.message, "error");
        }
    }

    function renderBarChart(selector, items, color) {
        var $chart = $(selector);
        $chart.empty();
        if (!items || items.length === 0) {
            $chart.html('<div class="chart-empty">No data available.</div>');
            return;
        }

        var maximum = Math.max.apply(null, items.map(function (item) { return item.count; }));
        items.forEach(function (item) {
            var percentage = maximum > 0 ? (item.count / maximum) * 100 : 0;
            var $row = $("<div>").addClass("bar-row");
            $row.append($("<span>").addClass("bar-label").text(item.label));
            $row.append($("<div>").addClass("bar-track").append(
                $("<div>").addClass("bar-fill").css({
                    width: percentage + "%",
                    background: color
                })
            ));
            $row.append($("<span>").addClass("bar-count").text(item.count));
            $chart.append($row);
        });
    }

    function renderActivityChart(activity) {
        var $chart = $("#activity-chart");
        $chart.empty();
        if (!activity || activity.length === 0) {
            $chart.html('<div class="chart-empty">No activity available.</div>');
            return;
        }

        var maximum = Math.max.apply(null, activity.map(function (item) { return item.results; }));
        activity.forEach(function (item) {
            var height = maximum > 0 ? Math.max((item.results / maximum) * 100, 3) : 3;
            var $column = $("<div>").addClass("activity-column").attr(
                "title",
                item.results + " results - " + item.score + " points"
            );
            $column.append($("<span>").addClass("activity-value").text(item.results));
            $column.append($("<div>").addClass("activity-bar").css("height", height + "%"));
            $column.append($("<span>").addClass("activity-label").text(item.label));
            $chart.append($column);
        });
    }

    function renderDistributionChart(items) {
        var $donut = $("#distribution-donut");
        var $legend = $("#distribution-legend");
        var colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
        var total = (items || []).reduce(function (sum, item) {
            return sum + item.count;
        }, 0);
        var offset = 0;
        var segments = [];

        $("#distribution-total").text(total);
        $legend.empty();

        if (total === 0) {
            $donut.css("background", "conic-gradient(#e2e8f0 0% 100%)");
            $legend.html('<div class="chart-empty">No questions available.</div>');
            return;
        }

        items.forEach(function (item, index) {
            var percentage = (item.count / total) * 100;
            var end = offset + percentage;
            var color = colors[index % colors.length];
            var label = item.label || "Uncategorized";
            var $legendItem = $("<div>").addClass("legend-item");

            segments.push(color + " " + offset + "% " + end + "%");
            $("<span>").addClass("dot").css("background", color).appendTo($legendItem);
            $("<span>").text(label).appendTo($legendItem);
            $("<span>").css("margin-left", "auto").text(item.count + " Qs").appendTo($legendItem);
            $legend.append($legendItem);
            offset = end;
        });

        $donut.css("background", "conic-gradient(" + segments.join(", ") + ")");
    }

    async function loadDashboardStats() {
        $("#activity-chart, #category-chart, #difficulty-chart").attr("aria-busy", "true");
        try {
            var res = await authFetch(API_BASE + "/admin/dashboard/stats", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load dashboard statistics");

            var data = body.data;
            $("#stat-total-questions").text(data.totals.questions);
            $("#stat-total-users").text(data.totals.users);
            $("#stat-total-results").text(data.totals.results);
            $("#stat-total-categories").text(data.totals.categories);
            $("#stat-total-score").text(data.totals.score);
            $("#stat-average-score").text(data.totals.average_score);
            renderActivityChart(data.activity);
            renderDistributionChart(data.questions.by_country);
            renderBarChart("#category-chart", data.questions.by_category, "#8b5cf6");
            renderBarChart("#difficulty-chart", data.questions.by_difficulty, "#10b981");
            $("#activity-chart, #category-chart, #difficulty-chart").removeAttr("aria-busy");
        } catch (err) {
            $(".chart-empty").text(err.message);
            $("#activity-chart, #category-chart, #difficulty-chart").removeAttr("aria-busy");
            showAdminFeedback("Dashboard statistics could not be loaded: " + err.message, "error");
        }
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

        var first = questionPagination.total === 0
            ? 0
            : ((questionPagination.page - 1) * questionPagination.perPage) + 1;
        var last = Math.min(questionPagination.page * questionPagination.perPage, questionPagination.total);
        $("#questions-page-summary").text(
            questionPagination.total === 0
                ? "No questions"
                : "Showing " + first + "-" + last + " of " + questionPagination.total
        );
        $("#questions-prev-btn").prop("disabled", questionPagination.page <= 1);
        $("#questions-next-btn").prop("disabled", questionPagination.page >= questionPagination.lastPage);
        renderQuestionFilterCategories();
    }

    function renderUsersTable() {
        var $body = $("#users-table-body");
        $body.empty();

        users.forEach(function (u) {
            var $row = $("<tr>");
            $row.append($("<td>").text("#" + u.id));
            $row.append($("<td>").text(u.name));
            $row.append($("<td>").text(u.email));
            $row.append($("<td>").text(u.role));
            $row.append($("<td>").text(u.level));
            $row.append($("<td>").text(u.total_score + " pts"));
            $row.append($("<td>").text(u.joined_at));
            var $actions = $("<td>");
            $("<button>", {
                type: "button",
                class: "user-action-button"
            }).text("Edit").on("click", function () {
                openUserEdit(u);
            }).appendTo($actions);
            $("<button>", {
                type: "button",
                class: "user-action-button delete"
            }).text("Delete").on("click", function () {
                deleteUser(u);
            }).appendTo($actions);
            $row.append($actions);
            $body.append($row);
        });

        if (users.length === 0) {
            $body.append('<tr><td colspan="8">No users yet.</td></tr>');
        }

        $("#stat-total-users").text(users.length);
        var totalResults = users.reduce(function (sum, u) { return sum + (u.quizzes_played || 0); }, 0);
        $("#stat-total-results").text(totalResults);
    }

    function renderCategoriesTable() {
        var $body = $("#categories-table-body");
        $body.empty();
        $("#categories-count").text(categories.length + " categor" + (categories.length === 1 ? "y" : "ies"));
        renderCategoryOptions();

        categories.forEach(function (category) {
            var $row = $("<tr>");
            $row.append($("<td>").text(category.name));
            $row.append($("<td>").text(category.question_count));
            var $actions = $("<td>");
            $("<button>", {
                type: "button",
                class: "category-action-button"
            }).text("Edit").on("click", function () {
                openCategoryEdit(category);
            }).appendTo($actions);
            var deleteButton = $("<button>", {
                type: "button",
                class: "category-action-button delete"
            }).text("Delete").on("click", function () {
                deleteCategory(category);
            });
            deleteButton.appendTo($actions);
            $row.append($actions);
            $body.append($row);
        });

        if (categories.length === 0) {
            $body.append('<tr><td colspan="3">No categories yet.</td></tr>');
        }
    }

    function showCategoryError(message) {
        $("#category-form-error").text(message).prop("hidden", false);
    }

    function clearCategoryForm() {
        $("#edit-category-id").val("");
        $("#category-name").val("");
        $("#save-category-btn").text("Add Category");
        $("#cancel-category-btn").prop("hidden", true);
        $("#category-form-error").text("").prop("hidden", true);
    }

    function openCategoryEdit(category) {
        $("#edit-category-id").val(category.id);
        $("#category-name").val(category.name);
        $("#save-category-btn").text("Update Category");
        $("#cancel-category-btn").prop("hidden", false);
        $("#category-form-error").text("").prop("hidden", true);
    }

    async function loadCategories() {
        $("#category-form-error").prop("hidden", true);
        $("#categories-table").attr("aria-busy", "true");
        $("#categories-table-body").html('<tr><td colspan="3" role="status" aria-live="polite">Loading categories...</td></tr>');
        try {
            var res = await authFetch(API_BASE + "/admin/categories", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load categories");
            categories = body.data;
            renderCategoriesTable();
            clearForm();
            $("#categories-table").removeAttr("aria-busy");
        } catch (err) {
            categories = [];
            $("#categories-table-body").html('<tr><td colspan="3">' + escapeHtml(err.message) + "</td></tr>");
            showCategoryError(err.message);
            $("#categories-table").removeAttr("aria-busy");
            showAdminFeedback("Categories could not be loaded: " + err.message, "error");
        }
    }

    async function saveCategory() {
        var $button = $("#save-category-btn");
        var id = $("#edit-category-id").val();
        var name = $("#category-name").val().trim();
        if (!name) {
            showCategoryError("Please enter a category name.");
            showAdminFeedback("Please enter a category name.", "error");
            return;
        }

        setButtonPending($button, true, "Saving...");
        try {
            var url = API_BASE + "/admin/categories" + (id ? "/" + id : "");
            var res = await authFetch(url, {
                method: id ? "PUT" : "POST",
                body: JSON.stringify({ name: name })
            });
            var body = await res.json();
            if (!res.ok) {
                var firstError = body.errors && Object.values(body.errors)[0];
                throw new Error((firstError && firstError[0]) || body.message || "Failed to save category");
            }
            clearCategoryForm();
            showAdminFeedback(id ? "Category updated." : "Category added.", "success");
            await loadCategories();
            await loadQuestionOptions();
            await loadQuestions();
        } catch (err) {
            showCategoryError(err.message);
            showAdminFeedback("Category could not be saved: " + err.message, "error");
        } finally {
            setButtonPending($button, false);
            if (!$("#edit-category-id").val()) {
                $button.text("Add Category");
            }
        }
    }

    async function deleteCategory(category) {
        var replacementCategory = null;
        if (category.question_count > 0) {
            replacementCategory = window.prompt(
                "This category has " + category.question_count +
                " question(s). Enter another category name to move them to:"
            );
            if (!replacementCategory || replacementCategory.trim() === "") return;
            replacementCategory = replacementCategory.trim();
        }
        if (!window.confirm("Delete category " + category.name + "?")) return;

        showAdminFeedback("Deleting category...", "loading");
        try {
            var options = { method: "DELETE" };
            if (replacementCategory) {
                options.body = JSON.stringify({ replacement_category: replacementCategory });
            }
            var res = await authFetch(API_BASE + "/admin/categories/" + category.id, options);
            if (!res.ok && res.status !== 204) {
                var body = await res.json().catch(function () { return {}; });
                throw new Error(body.message || "Failed to delete category");
            }
            showAdminFeedback("Category deleted.", "success");
            await loadCategories();
            await loadQuestions();
        } catch (err) {
            showCategoryError(err.message);
            showAdminFeedback("Category could not be deleted: " + err.message, "error");
        }
    }

    var settingFields = [
        "quiz_length", "lives", "timer_seconds", "streak_length",
        "easy_questions", "medium_questions", "hard_questions",
        "easy_points", "medium_points", "hard_points",
        "streak_bonus", "daily_bonus"
    ];

    function renderSettings() {
        settingFields.forEach(function (key) {
            $("#setting-" + key.replace(/_/g, "-")).val(settings[key]);
        });
    }

    async function loadSettings() {
        $("#settings-status").text("Loading settings...").attr("role", "status").attr("aria-live", "polite");
        $("#settings-error").prop("hidden", true);
        try {
            var res = await authFetch(API_BASE + "/admin/settings", { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load settings");
            settings = body.data;
            renderSettings();
            $("#settings-status").text("Settings loaded");
        } catch (err) {
            $("#settings-error").text(err.message).prop("hidden", false);
            $("#settings-status").text("Settings unavailable");
            showAdminFeedback("Settings could not be loaded: " + err.message, "error");
        }
    }

    async function saveSettings() {
        var $button = $("#save-settings-btn");
        var payload = {};
        settingFields.forEach(function (key) {
            payload[key] = parseInt($("#setting-" + key.replace(/_/g, "-")).val(), 10);
        });
        $("#settings-error").prop("hidden", true);
        $("#settings-status").text("Saving...");
        setButtonPending($button, true, "Saving...");

        try {
            var res = await authFetch(API_BASE + "/admin/settings", {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            var body = await res.json();
            if (!res.ok) {
                var firstError = body.errors && Object.values(body.errors)[0];
                throw new Error((firstError && firstError[0]) || body.message || "Failed to save settings");
            }
            settings = body.data;
            renderSettings();
            $("#settings-status").text("Settings saved");
            showAdminFeedback("Settings saved.", "success");
        } catch (err) {
            $("#settings-status").text("");
            $("#settings-error").text(err.message).prop("hidden", false);
            showAdminFeedback("Settings could not be saved: " + err.message, "error");
        } finally {
            setButtonPending($button, false);
        }
    }

    function showUserError(message) {
        $("#users-error").text(message).prop("hidden", false);
    }

    function clearUserError() {
        $("#users-error").text("").prop("hidden", true);
    }

    function loadUsers() {
        var params = new URLSearchParams();
        var search = $("#users-search").val().trim();
        var role = $("#users-role-filter").val();
        if (search) params.set("search", search);
        if (role) params.set("role", role);

        clearUserError();
        $("#users-table").attr("aria-busy", "true");
        $("#users-table-body").html('<tr><td colspan="8" role="status" aria-live="polite">Loading users...</td></tr>');

        var query = params.toString();
        var url = API_BASE + "/admin/users" + (query ? "?" + query : "");

        return authFetch(url, { method: "GET" })
            .then(function (res) {
                return res.json().then(function (body) {
                    if (!res.ok) throw new Error(body.message || "Failed to load users");
                    users = body.data;
                    renderUsersTable();
                    $("#users-table").removeAttr("aria-busy");
                });
            })
            .catch(function (err) {
                users = [];
                $("#users-table-body").html('<tr><td colspan="8">' + escapeHtml(err.message) + "</td></tr>");
                showUserError(err.message);
                $("#users-table").removeAttr("aria-busy");
                showAdminFeedback("Users could not be loaded: " + err.message, "error");
            });
    }

    function openUserEdit(user) {
        clearUserError();
        $("#user-form-error").text("").prop("hidden", true);
        $("#edit-user-id").val(user.id);
        $("#edit-user-name").val(user.name);
        $("#edit-user-email").val(user.email);
        $("#edit-user-role").val(user.role);
        $("#edit-user-password").val("");
        $("#edit-user-reset-mfa").prop("checked", false);
        $("#user-edit-panel").prop("hidden", false);
    }

    function closeUserEdit() {
        $("#user-edit-panel").prop("hidden", true);
        $("#edit-user-id").val("");
        $("#user-form-error").text("").prop("hidden", true);
    }

    async function saveUser() {
        var $button = $("#save-user-btn");
        var id = $("#edit-user-id").val();
        var payload = {
            name: $("#edit-user-name").val().trim(),
            email: $("#edit-user-email").val().trim(),
            role: $("#edit-user-role").val(),
            reset_mfa: $("#edit-user-reset-mfa").prop("checked")
        };
        var password = $("#edit-user-password").val();
        if (password) payload.password = password;

        $("#user-form-error").text("").prop("hidden", true);
        setButtonPending($button, true, "Saving...");
        try {
            var res = await authFetch(API_BASE + "/admin/users/" + id, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            var body = await res.json();
            if (!res.ok) {
                var firstError = body.errors && Object.values(body.errors)[0];
                throw new Error((firstError && firstError[0]) || body.message || "Failed to save user");
            }
            closeUserEdit();
            showAdminFeedback("User details saved.", "success");
            await loadUsers();
        } catch (err) {
            $("#user-form-error").text(err.message).prop("hidden", false);
            showAdminFeedback("User could not be saved: " + err.message, "error");
        } finally {
            setButtonPending($button, false);
        }
    }

    async function deleteUser(user) {
        if (String(user.id) === String(getCurrentUserId())) {
            showAdminFeedback("You cannot delete your own administrator account.", "error");
            return;
        }
        if (!window.confirm("Delete " + user.name + "? This cannot be undone.")) return;

        showAdminFeedback("Deleting user...", "loading");
        try {
            var res = await authFetch(API_BASE + "/admin/users/" + user.id, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                var body = await res.json().catch(function () { return {}; });
                throw new Error(body.message || "Failed to delete user");
            }
            showAdminFeedback("User deleted.", "success");
            await loadUsers();
        } catch (err) {
            showUserError(err.message);
            showAdminFeedback("User could not be deleted: " + err.message, "error");
        }
    }

    function formatResultDate(date) {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    }

    function renderResultsTable() {
        var $body = $("#results-table-body");
        $body.empty();
        $("#results-count").text(results.length + " result" + (results.length === 1 ? "" : "s"));

        results.forEach(function (result) {
            var $row = $("<tr>");
            $row.append($("<td>").text("#" + result.id));
            $row.append($("<td>").append(
                $("<strong>").text(result.user.name),
                $("<br>"),
                $("<small>").text(result.user.email)
            ));
            $row.append($("<td>").text(result.score + " pts"));
            $row.append($("<td>").text(result.correct_answers));
            $row.append($("<td>").text(result.lives_remaining));
            $row.append($("<td>").text(result.xp_earned));
            $row.append($("<td>").text(result.daily ? "Daily" : "Standard"));
            $row.append($("<td>").text(formatResultDate(result.date)));

            var $action = $("<button>").attr({
                type: "button",
                class: "result-view-button"
            }).text("View");
            $action.on("click", function () { showResultDetail(result.id); });
            $row.append($("<td>").append($action));
            $body.append($row);
        });

        if (results.length === 0) {
            $body.append('<tr><td colspan="9">No results found.</td></tr>');
        }
    }

    function showResultError(message) {
        $("#results-error").text(message).prop("hidden", false);
    }

    async function loadResults() {
        var params = new URLSearchParams();
        var search = $("#results-search").val().trim();
        if (search) params.set("search", search);
        if ($("#results-daily").prop("checked")) params.set("daily", "1");
        if ($("#results-from").val()) params.set("from", $("#results-from").val());
        if ($("#results-to").val()) params.set("to", $("#results-to").val());

        $("#results-error").prop("hidden", true);
        $("#results-table").attr("aria-busy", "true");
        $("#results-table-body").html('<tr><td colspan="9" role="status" aria-live="polite">Loading results...</td></tr>');

        try {
            var query = params.toString();
            var url = API_BASE + "/admin/results" + (query ? "?" + query : "");
            var res = await authFetch(url, { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load results");
            results = body.data;
            renderResultsTable();
            $("#results-table").removeAttr("aria-busy");
        } catch (err) {
            results = [];
            $("#results-table-body").html('<tr><td colspan="9">' + escapeHtml(err.message) + "</td></tr>");
            showResultError(err.message);
            $("#results-table").removeAttr("aria-busy");
            showAdminFeedback("Results could not be loaded: " + err.message, "error");
        }
    }

    async function showResultDetail(resultId) {
        var detail = $("#result-detail");
        detail.prop("hidden", false).attr("aria-busy", "true").text("Loading result...");

        try {
            var res = await authFetch(API_BASE + "/admin/results/" + resultId, { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load result");

            var result = body.data;
            detail.html(
                "<strong>Result #" + result.id + "</strong> · " +
                escapeHtml(result.user.name) + " · " +
                result.score + " points · " +
                result.correct_answers + " correct answers · " +
                result.lives_remaining + " lives remaining · " +
                result.xp_earned + " XP"
            ).removeAttr("aria-busy");
        } catch (err) {
            detail.text(err.message).removeAttr("aria-busy");
            showAdminFeedback("Result details could not be loaded: " + err.message, "error");
        }
    }

    async function loadQuestions() {
        var params = new URLSearchParams();
        var search = $("#questions-search").val().trim();
        var category = $("#questions-category-filter").val();
        var country = $("#questions-country-filter").val();
        var difficulty = $("#questions-difficulty-filter").val();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (country) params.set("country", country);
        if (difficulty) params.set("difficulty", difficulty);
        params.set("page", questionPagination.page);
        params.set("per_page", questionPagination.perPage);

        $("#questions-error").prop("hidden", true);
        $("#questions-table").attr("aria-busy", "true");
        $("#questions-table-body").html('<tr><td colspan="6" role="status" aria-live="polite">Loading questions...</td></tr>');

        try {
            var res = await authFetch(API_BASE + "/admin/questions?" + params.toString(), { method: "GET" });
            var body = await res.json();
            if (!res.ok) throw new Error(body.message || "Failed to load questions");
            questions = body.data;
            questionPagination.page = body.meta.current_page;
            questionPagination.total = body.meta.total;
            questionPagination.lastPage = body.meta.last_page;
            renderQuestionsTable();
            $("#questions-table").removeAttr("aria-busy");
        } catch (err) {
            $("#questions-table-body").html('<tr><td colspan="6">' + escapeHtml(err.message) + "</td></tr>");
            $("#questions-error").text(err.message).prop("hidden", false);
            $("#questions-table").removeAttr("aria-busy");
            showAdminFeedback("Questions could not be loaded: " + err.message, "error");
        }
    }

    async function importQuestions() {
        var fileInput = $("#questions-import-file")[0];
        var file = fileInput.files[0];
        var $status = $("#questions-import-export-status");

        $status.removeClass("success-message");
        if (!file) {
            $status.prop("hidden", false).text("Choose a CSV file to import.");
            showAdminFeedback("Choose a CSV file to import.", "error");
            return;
        }
        if (!window.confirm("Import questions from " + file.name + "? Invalid rows will prevent the entire import.")) {
            return;
        }

        $status.prop("hidden", false);
        var formData = new FormData();
        formData.append("file", file);
        $("#questions-import-btn").prop("disabled", true).text("Importing...");
        $status.text("Uploading and validating questions...");
        showAdminFeedback("Importing questions...", "loading");

        try {
            var res = await authFetch(API_BASE + "/admin/questions/import", {
                method: "POST",
                body: formData
            });
            var body = await res.json();
            if (!res.ok) {
                var details = (Array.isArray(body.errors) ? body.errors : []).map(function (item) {
                    var messages = Object.values(item.errors || {}).flat();
                    return "Row " + item.row + ": " + messages.join(" ");
                });
                var validationErrors = Array.isArray(body.errors) ? [] : Object.values(body.errors || {}).flat();
                throw new Error(details.concat(validationErrors).join(" ") || body.message || "Failed to import questions");
            }

            $status.addClass("success-message").text(body.message + " (" + body.imported + ")");
            showAdminFeedback(body.message + " (" + body.imported + ")", "success");
            fileInput.value = "";
            questionPagination.page = 1;
            await loadCategories();
            await loadQuestionOptions();
            await loadQuestions();
        } catch (err) {
            $status.text(err.message);
            showAdminFeedback("Questions could not be imported: " + err.message, "error");
        } finally {
            $("#questions-import-btn").prop("disabled", false).text("Import questions");
        }
    }

    async function exportQuestions() {
        var $button = $("#questions-export-btn");
        var $status = $("#questions-import-export-status");
        $button.prop("disabled", true).text("Preparing export...");
        $status.removeClass("success-message").prop("hidden", true);
        showAdminFeedback("Preparing question export...", "loading");

        try {
            var res = await authFetch(API_BASE + "/admin/questions/export", { method: "GET" });
            if (!res.ok) {
                var body = await res.json().catch(function () { return {}; });
                throw new Error(body.message || "Failed to export questions");
            }

            var downloadUrl = URL.createObjectURL(await res.blob());
            var link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "euroquiz-questions.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 1000);
            showAdminFeedback("Question export downloaded.", "success");
        } catch (err) {
            $status.prop("hidden", false).text(err.message);
            showAdminFeedback("Questions could not be exported: " + err.message, "error");
        } finally {
            $button.prop("disabled", false).text("Export all questions");
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
        $("#question-text").val(q.question_text);
        $("#opt-a").val(q.option_a);
        $("#opt-b").val(q.option_b);
        $("#opt-c").val(q.option_c);
        $("#opt-d").val(q.option_d);
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

        showAdminFeedback("Deleting question...", "loading");
        try {
            var res = await authFetch(API_BASE + "/admin/questions/" + id, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                var body = await res.json().catch(function () { return {}; });
                throw new Error(body.message || "Failed to delete question");
            }
            questions = questions.filter(function (q) { return q.id !== id; });
            renderQuestionsTable();
            showAdminFeedback("Question deleted.", "success");
            await loadQuestionOptions();
        } catch (err) {
            $("#questions-error").text(err.message).prop("hidden", false);
            showAdminFeedback("Question could not be deleted: " + err.message, "error");
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
            country: $("#question-nation").val().trim().toUpperCase(),
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

        var $button = $("#submit-question-btn");
        setButtonPending($button, true, "Saving...");
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
            showAdminFeedback(editId ? "Question updated." : "Question added.", "success");
            await loadCategories();
            await loadQuestionOptions();
            await loadQuestions();
        } catch (err) {
            showFormError(err.message);
            showAdminFeedback("Question could not be saved: " + err.message, "error");
        } finally {
            setButtonPending($button, false);
            if (!$("#edit-question-id").val()) {
                $button.text("Add Question Entry");
            }
        }
    });

    $("#results-filter-btn").on("click", loadResults);
    $("#results-search").on("keydown", function (event) {
        if (event.key === "Enter") loadResults();
    });
    $("#users-filter-btn").on("click", loadUsers);
    $("#users-search").on("keydown", function (event) {
        if (event.key === "Enter") loadUsers();
    });
    $("#cancel-user-edit-btn").on("click", closeUserEdit);
    $("#save-user-btn").on("click", saveUser);
    $("#save-category-btn").on("click", saveCategory);
    $("#cancel-category-btn").on("click", clearCategoryForm);
    $("#save-settings-btn").on("click", saveSettings);
    $("#questions-filter-btn").on("click", function () {
        questionPagination.page = 1;
        loadQuestions();
    });
    $("#question-nation").on("input", function () {
        this.value = this.value.toUpperCase();
    });
    $("#questions-import-btn").on("click", importQuestions);
    $("#questions-export-btn").on("click", exportQuestions);
    $("#questions-prev-btn").on("click", function () {
        if (questionPagination.page > 1) {
            questionPagination.page--;
            loadQuestions();
        }
    });
    $("#questions-next-btn").on("click", function () {
        if (questionPagination.page < questionPagination.lastPage) {
            questionPagination.page++;
            loadQuestions();
        }
    });
    $("#questions-search").on("keydown", function (event) {
        if (event.key === "Enter") {
            questionPagination.page = 1;
            loadQuestions();
        }
    });

    clearForm();
    loadQuestions();
    loadUsers();
    loadResults();
    loadCategories();
    loadQuestionOptions();
    loadSettings();
    loadDashboardStats();
});
