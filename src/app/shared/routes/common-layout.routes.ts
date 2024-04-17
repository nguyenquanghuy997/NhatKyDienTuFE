import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [

    // //Apps
    // {
    //     path: 'apps',
    //     data: {
    //         title: 'Apps'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: '/dashboard',
    //             pathMatch: 'full'
    //         }, 
    //         {
    //             path: '',
    //             loadChildren: () => import('../../apps/apps.module').then(m => m.AppsModule)
    //         },
    //     ]    
    // },
    
    // E-Diary
    {
        path: '',
        data: {
            title: 'E-Diary'
        },
        children: [
            {
                path: '',
                redirectTo: '/e-diary',
                pathMatch: 'full'
            }, 
            {
                path: '',
                loadChildren: () => import('../../e-diary/e-diary.module').then(m => m.EDiaryModule)
            },
        ]    
    }
];