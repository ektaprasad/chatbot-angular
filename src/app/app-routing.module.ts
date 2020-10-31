import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './modules/chat/chat.component';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
  },
  { path: '', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}