import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { CommonModule } from "@angular/common"

import { AppComponent } from "./app.component"
import { LogViewerComponent } from "./components/log-viewer/log-viewer.component"
import { LogModalComponent } from "./components/log-modal/log-modal.component"
import { JsonModalComponent } from "./components/json-modal/json-modal.component"
import { JsonViewerComponent } from "./components/json-viewer/json-viewer.component"

@NgModule({
  declarations: [AppComponent, LogViewerComponent, LogModalComponent, JsonModalComponent, JsonViewerComponent],
  imports: [BrowserModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
