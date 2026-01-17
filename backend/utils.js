/**
 * Returns a color string ("green", "yellow", or "red") based on how close a value is to its target.
 *
 * The percentage of the value relative to the target is calculated as:  
 * `(value / target) * 100`
 *
 * The function then compares this percentage to the provided thresholds:
 * - If `percentage >= g_thresh`, returns `"green"`
 * - Else if `percentage >= y_thresh`, returns `"yellow"`
 * - Otherwise, returns `"red"`
 *
 * @param {number} target - The target value to compare against.
 * @param {number} value - The actual value to evaluate.
 * @param {number} y_thresh - The minimum percentage (of target) needed to return "yellow".
 * @param {number} g_thresh - The minimum percentage (of target) needed to return "green".
 * @returns {string} A color string indicating performance: "green", "yellow", or "red".
 *
 * @example
 * getColor(100, 90, 70, 90); // returns "green"
 * getColor(100, 75, 70, 90); // returns "yellow"
 * getColor(100, 50, 70, 90); // returns "red"
 */

function getColor(target, value, y_thresh, g_thresh) {
  const p = value * 100 / target;
  if (p >= g_thresh) {
    return "green";
  } else if (p >= y_thresh) {
    return 'yellow';
  } else {
    return 'red';
  }
}

function buildEmployeeWhereClause(user) {
  if (user.role === "Admin") {
    return {};
  }
  if (user.role === "Manager") {
    return {
      OR: [
        { manager_id: user.id },
        { id: user.id }
      ]
    };
  }
  return {
    id: user.id
  };
}
// This Fucntion fetchs department as per id 
function departmentwhereclause(user) {
  // ADMIN → all departments
  if (user.role === "Admin") {
    return {};
  }

  // MANAGER → departments of employees they manage
  if (user.role === "Manager") {
    return {
      employees: {
        some: {
          OR: [
            { id: user.id },
            { manager_id: user.id },
          ],
        },
      },
    };
  }

  // EMPLOYEE → only their own department
  return {
    employees: {
      some: {
        id: user.id,
      },
    }
  };
}


module.exports = {
  getColor, buildEmployeeWhereClause, departmentwhereclause
}
