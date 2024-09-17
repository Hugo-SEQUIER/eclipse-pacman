use anchor_lang::prelude::*;

declare_id!("DjUfeeJXsQHPd811GHmhB6zVraAyBBVzv365BA8Ruf8T");

#[program]
pub mod pacman_game {
    use super::*;

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        // Placeholder logic to start the game
        msg!("Pacman game has started!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
}
