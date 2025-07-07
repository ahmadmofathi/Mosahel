// has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private currentRole: string;

  @Input() set appHasRole(roles: string[]) {
    if (this.checkRolePermission(roles)) {
      // Show the element if the user has the required role(s)
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Hide the element
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    // Load roles from AuthService
    this.currentRole = localStorage.getItem('role') ?? '';
  }

  private checkRolePermission(requiredRoles: string[]): boolean {
    const res = requiredRoles.some((role) => this.currentRole === role);
    return res;
  }
}
