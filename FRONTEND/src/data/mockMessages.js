export const initialMessages = [
  {
    id: "1",
    problem: "Evaluate the potential impact of modular atomic architecture on front-end scalability and team velocity in a distributed micro-frontend environment.",
    solution_1: `### The Compositional Approach\nModular atomic architecture provides a rigid yet fluid framework for design system implementation. By breaking down the UI into Atoms, Molecules, and Organisms, we ensure that every micro-frontend consumer inherits a consistent visual language.\n\nScalability is achieved through dependency isolation. Each module exists as a self-contained registry entry, allowing teams to update the 'Search Atom' without risk of cascading failures in the 'Payment Organism'.\n\n- Reduced visual regression testing overhead.\n- Accelerated onboarding for new domain engineers.\n- Optimized bundle sizes via tree-shaking atomic units.\n\nHere is an example structure:\n\`\`\`javascript\nimport { Button } from '@core/atoms';\nimport { SearchBar } from '@core/molecules';\n\nexport const Header = () => (\n  <header className="flex justify-between">\n    <SearchBar />\n    <Button variant="primary">Login</Button>\n  </header>\n);\n\`\`\``,
    solution_2: `### Functional Decomposition Strategy\nThis model focuses on functional boundaries rather than visual hierarchy. While atomic design is useful, the primary bottleneck in micro-frontends is state orchestration.\n\nTeam velocity is maximized by providing a set of 'Smart Templates' that handle cross-cutting concerns like authentication and analytics automatically. This abstracts the 'atomic' complexity away from the developer.\n\n> "The velocity gains here are concentrated in the domain logic, not the UI presentation layer."\n\nImplementing a template manager:\n\`\`\`javascript\nclass TemplateManager {\n  constructor(deps) {\n    this.auth = deps.auth;\n    this.analytics = deps.analytics;\n  }\n\n  inject(component) {\n    // Automatically handle common cross-cutting concerns\n    return withAuth(withAnalytics(component));\n  }\n}\n\`\`\``,
    judge: {
      solution_1_score: 10,
      solution_2_score: 9,
      solution_1_reasoning: "Solution 1 is selected for its superior long-term maintainability. In a micro-frontend architecture, the risk of visual fragmentation is high. By enforcing an atomic standard, you decouple the design evolution from the deployment cycles of individual domain teams.",
      solution_2_reasoning: "Solution 2 offers immediate velocity gains but introduces technical debt in the form of \"Template Bloat.\" It is better suited for rapid prototyping rather than a foundational enterprise infrastructure."
    }
  }
];
