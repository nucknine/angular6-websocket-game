import { Routes } from "@angular/router";
import { HostComponent } from "./app/host/host.component";
import { HomeComponent } from "./app/home/home.component";
import { ClientComponent } from "./app/client/client.component";


export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "host",
        component: HostComponent
    },
    {
        path: "client",
        component: ClientComponent
    }
];