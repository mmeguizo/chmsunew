import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConnectionService } from "./connection.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  public authToken;
  public options;
  picture: HttpHeaders;

  constructor(
    public auth: AuthService,
    public cs: ConnectionService,
    private http: HttpClient
  ) {}

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "image/jpeg",
      authorization: this.authToken,
    });
  }

  loadToken() {
    const token = localStorage.getItem("token");
    this.authToken = token;
  }

  private getEndpoint(model: string, apiName: string) {
    return `${this.cs.domain}/${model}/${apiName}`;
  }
  //http://localhost:3000/department/getAllDepartment

  getRoute(
    endpoint: string,
    model: string,
    apiName: string,
    data?: string | Object
  ) {
    this.createAuthenticationHeaders();

    const requestOptions = {
      headers: this.options,
    };

    if (endpoint === "put") {
      return this.http.put(
        this.getEndpoint(model, apiName),
        data,
        requestOptions
      );
    } else if (endpoint === "post") {
      return this.http.post(
        this.getEndpoint(model, apiName),
        data,
        requestOptions
      );
    } else {
      return this.http.get(this.getEndpoint(model, apiName), requestOptions);
    }
  }
}
