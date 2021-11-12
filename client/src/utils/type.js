class SubclassResponsibilityError extends Error { }

class ProgressType {
  get cssClassName() { throw new SubclassResponsibilityError(); }
  get toString() { throw new SubclassResponsibilityError(); }
}
export class ProceedType extends ProgressType {
  get cssClassName() { return "bg-blue"; }
  get toString() { return "진행중"; }
}

export class EndType extends ProgressType {
  get cssClassName() { return "bg-yellow"; }
  get toString() { return "완료"; }
}

