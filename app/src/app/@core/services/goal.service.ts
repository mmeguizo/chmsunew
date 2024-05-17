import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ConnectionService } from "./connection.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GoalService {
  private authToken;
  private options;

  constructor(
    private auth: AuthService,
    private cs: ConnectionService,
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

  getRoute(endpoint: any, model?: any, apiName?: any, data?: any) {
    console.log("getRoute", { endpoint, model, apiName, data });
    this.createAuthenticationHeaders();
    const url = `${this.cs.domain}/${model}/${apiName}`;
    return this.http.request(endpoint, url, {
      body: data,
      headers: this.options,
    });
  }

  // getRoute(endpoint: string, model: string, apiName: string, data?: any) {
  //   this.createAuthenticationHeaders();
  //   const requestOptions = {
  //     headers: this.options,
  //   };

  //   const url = `${this.cs.domain}/${model}/${apiName}`;
  //   switch (endpoint) {
  //     case "put":
  //       return this.http.put(url, data, requestOptions);
  //     case "post":
  //       return this.http.post(url, data, requestOptions);
  //     default:
  //       return this.http.get(url, requestOptions);
  //   }
  // }
}
