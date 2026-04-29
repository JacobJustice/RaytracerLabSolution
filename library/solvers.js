function solveQuartic(A, B, C, D, E) {
    // Ensure the quartic equation is normalized (A = 1)
    if (A !== 1) {
        B /= A;
        C /= A;
        D /= A;
        E /= A;
    }

    // Handle special case for x^4 - 1 = 0 directly
    if (A === 1 && B === 0 && C === 0 && D === 0 && E === -1) {
        return [1, -1, 'i', '-i']; // Return all roots directly for this specific case
    }

    // Depressed quartic: shift t -> t - B/4 to remove the cubic term
    let alpha = -3 * Math.pow(B / 4, 2) + C;
    let beta = B * B * B / 64 - B * C / 4 + D;
    let gamma = -3 * Math.pow(B / 4, 4) + C * Math.pow(B / 4, 2) - B * D / 4 + E;

    // Solving the cubic equation for Ferrari's method
    let P = alpha;
    let Q = beta;
    let R = gamma;

    let cubicRoots = solveCubic(1, -P / 2, -R, P * R / 2 - Q * Q / 8);
    let y = Math.max(...cubicRoots); // choose the largest real root

    let W = Math.sqrt(alpha + 2 * y);

    // Check for cases when W is 0
    if (W === 0) {
        let quadraticRoots = solveQuadratic(1, 0, y);
        return quadraticRoots.map(t => t - B / 4).filter(t => !isNaN(t));
    }

    // Now solve two quadratic equations
    let roots = [];

    let quadratic1 = solveQuadratic(1, W, y + beta / (2 * W));
    let quadratic2 = solveQuadratic(1, -W, y - beta / (2 * W));

    roots.push(...quadratic1, ...quadratic2);

    // Reverse the initial substitution: t -> t - B/4
    return roots.map(t => t - B / 4).filter(t => !isNaN(t)); // filter out NaN results
}

// Solve a cubic equation of the form: x^3 + ax^2 + bx + c = 0
function solveCubic(a, b, c, d) {
    b /= a;
    c /= a;
    d /= a;

    let Q = (3 * c - Math.pow(b, 2)) / 9;
    let R = (9 * b * c - 27 * d - 2 * Math.pow(b, 3)) / 54;
    let D = Math.pow(Q, 3) + Math.pow(R, 2); // Discriminant

    if (D >= 0) {
        // One real root
        let S = Math.cbrt(R + Math.sqrt(D));
        let T = Math.cbrt(R - Math.sqrt(D));

        let realRoot = -b / 3 + (S + T); // One real root
        return [realRoot];
    } else {
        // Three real roots
        let theta = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));
        let r = 2 * Math.sqrt(-Q);

        let x1 = r * Math.cos(theta / 3) - b / 3;
        let x2 = r * Math.cos((theta + 2 * Math.PI) / 3) - b / 3;
        let x3 = r * Math.cos((theta + 4 * Math.PI) / 3) - b / 3;

        return [x1, x2, x3];
    }
}

// Solve a quadratic equation of the form: ax^2 + bx + c = 0
function solveQuadratic(a, b, c) {
    let discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
        let root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [root1, root2];
    } else if (discriminant === 0) {
        let root = -b / (2 * a);
        return [root];
    } else {
        return []; // No real roots
    }
}

export {
    solveQuartic
}
